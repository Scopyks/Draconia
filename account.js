// DRACONIA - COMPTE SIMPLE PAR PSEUDO ET CLÉ SECRÈTE
(function(){
const SESSION_KEY="draconiaCloudSessionV1",HASH_KEY="draconiaCloudLastHashV1",BACKUP_KEY="draconiaCloudConflictBackupV1";
const cloud=DraconiaConfig.cloud||{},configured=/^https:\/\//.test(cloud.supabaseUrl||"")&&Boolean(cloud.supabaseAnonKey);
let busy=false,lastMessage="",syncTimer=null;
const panel=()=>document.getElementById("account-panel");
const escape=value=>String(value||"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
function readSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||"null")}catch{return null}}
function writeSession(value){if(value)localStorage.setItem(SESSION_KEY,JSON.stringify(value));else localStorage.removeItem(SESSION_KEY)}
function gameSnapshot(){
    const save={};
    for(let index=0;index<localStorage.length;index++){
        const key=localStorage.key(index);
        if(key&&key.startsWith("draconia")&&!key.startsWith("draconiaCloud"))save[key]=localStorage.getItem(key);
    }
    return Object.fromEntries(Object.entries(save).sort(([a],[b])=>a.localeCompare(b)));
}
function snapshotHash(save){
    const text=JSON.stringify(save);let hash=2166136261;
    for(let index=0;index<text.length;index++){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619)}
    return (hash>>>0).toString(16);
}
function applySnapshot(save){
    const incoming=save&&typeof save==="object"?save:{};
    const removable=[];
    for(let index=0;index<localStorage.length;index++){
        const key=localStorage.key(index);
        if(key&&key.startsWith("draconia")&&!key.startsWith("draconiaCloud")&&!(key in incoming))removable.push(key);
    }
    removable.forEach(key=>localStorage.removeItem(key));
    Object.entries(incoming).forEach(([key,value])=>{if(key.startsWith("draconia")&&!key.startsWith("draconiaCloud"))localStorage.setItem(key,String(value))});
}
async function rpc(name,body){
    const response=await fetch(cloud.supabaseUrl.replace(/\/$/,"")+"/rest/v1/rpc/"+name,{
        method:"POST",headers:{"Content-Type":"application/json","apikey":cloud.supabaseAnonKey,"Authorization":"Bearer "+cloud.supabaseAnonKey},
        body:JSON.stringify(body)
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.message||"Le service de compte est indisponible.");
    return data;
}
function generateKey(){
    const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",bytes=new Uint8Array(20);crypto.getRandomValues(bytes);
    const value=Array.from(bytes,byte=>chars[byte%chars.length]).join("");
    return "DRACO-"+value.match(/.{1,4}/g).join("-");
}
function styles(){
    if(document.getElementById("account-styles"))return;
    const style=document.createElement("style");style.id="account-styles";style.textContent=`
    .account-panel{margin:14px auto 90px;max-width:620px;padding:18px;border:1px solid #2f324f;border-radius:20px;background:#181a2d;color:#fff}
    .account-panel h3{margin:0 0 6px}.account-panel p{color:#c6c8df;font-size:13px;line-height:1.5}.account-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .account-box{padding:15px;border:1px solid #303452;border-radius:16px;background:#20233a}.account-box label{display:block;margin:10px 0 5px;font-size:12px;font-weight:800}
    .account-box input{box-sizing:border-box;width:100%;min-height:44px;padding:10px 12px;border:1px solid #41466d;border-radius:11px;background:#141627;color:#fff;font-size:16px}
    .account-button{width:100%;min-height:45px;margin-top:12px;border:0;border-radius:12px;background:#7c3aed;color:#fff;font-weight:900}.account-button.secondary{background:#303451}.account-button.danger{background:#71303b}.account-button:disabled{opacity:.5}
    .account-status{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border-radius:15px;background:#20233a}.account-status strong{display:block}.account-status small{color:#aeb1ce}
    .account-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.account-message{margin-top:12px!important;color:#f0d28d!important}.account-key{margin:12px 0;padding:14px;border:2px solid #8b5cf6;border-radius:13px;background:#101225;text-align:center;word-break:break-all;font-weight:900;letter-spacing:.7px}
    @media(max-width:560px){.account-grid,.account-actions{grid-template-columns:1fr}.account-panel{padding:14px}}
    `;document.head.appendChild(style);
}
function render(){
    const host=panel();if(!host)return;styles();
    if(!configured){
        host.innerHTML='<h3>☁️ Comptes bientôt disponibles</h3><p>La structure sécurisée est prête. Il reste à relier le projet Supabase dans la configuration du jeu.</p>';
        return;
    }
    const session=readSession();
    if(session){
        host.innerHTML=`<div class="account-status"><div><strong>🐉 ${escape(session.username)}</strong><small>${busy?"Synchronisation…":"Compte connecté"}</small></div><span>☁️</span></div>
        <p>La progression de cet appareil est sauvegardée en ligne. Ta clé secrète n’est jamais affichée ni enregistrée par le jeu.</p>
        <div class="account-actions"><button class="account-button secondary" onclick="draconiaSyncAccount()">☁️ Synchroniser</button><button class="account-button secondary" onclick="draconiaRotateKey()">🔑 Nouvelle clé</button><button class="account-button danger" onclick="draconiaLogout()">Se déconnecter</button></div>
        ${lastMessage?'<p class="account-message">'+escape(lastMessage)+'</p>':""}`;
        return;
    }
    host.innerHTML=`<div class="account-grid">
      <form class="account-box" onsubmit="draconiaCreateAccount(event)"><h3>Créer un compte</h3><p>Ta sauvegarde actuelle sera envoyée sur ce compte.</p><label for="account-new-name">Pseudo unique</label><input id="account-new-name" minlength="3" maxlength="20" pattern="[A-Za-z0-9_-]+" autocomplete="username" required><button class="account-button" ${busy?"disabled":""}>Créer et générer ma clé</button></form>
      <form class="account-box" onsubmit="draconiaLogin(event)"><h3>Se reconnecter</h3><p>Utilise exactement le pseudo et la clé reçue à la création.</p><label for="account-login-name">Pseudo</label><input id="account-login-name" autocomplete="username" required><label for="account-login-key">Clé secrète</label><input id="account-login-key" type="password" autocomplete="current-password" required><button class="account-button" ${busy?"disabled":""}>Se connecter</button></form>
    </div>${lastMessage?'<p class="account-message">'+escape(lastMessage)+'</p>':""}`;
}
function showKey(username,key,title){
    const host=panel();if(!host)return;
    host.innerHTML=`<h3>${escape(title)}</h3><p>Voici la seule copie de ta clé. Conserve-la dans un endroit sûr : sans elle et sans appareil connecté, le compte sera irrécupérable.</p><div class="account-key" id="generated-account-key">${escape(key)}</div><button class="account-button" onclick="draconiaCopyKey()">Copier la clé</button><button class="account-button secondary" onclick="draconiaFinishKey()">J’ai conservé ma clé</button>`;
}
async function createAccount(event){
    event.preventDefault();if(busy)return;
    const username=document.getElementById("account-new-name").value.trim(),key=generateKey();busy=true;lastMessage="";render();
    try{
        const data=await rpc("create_draconia_account",{p_username:username,p_secret_key:key,p_save:gameSnapshot()});
        const session={username:data.username,token:data.session_token,revision:Number(data.save_revision)||1};
        writeSession(session);localStorage.setItem(HASH_KEY,snapshotHash(gameSnapshot()));showKey(session.username,key,"Compte créé");
    }catch(error){lastMessage=error.message;busy=false;render();return}
    busy=false;
}
async function login(event){
    event.preventDefault();if(busy)return;
    const username=document.getElementById("account-login-name").value.trim(),key=document.getElementById("account-login-key").value.trim();busy=true;lastMessage="";render();
    try{
        const data=await rpc("login_draconia_account",{p_username:username,p_secret_key:key});
        if(data.error==="RATE_LIMITED")throw new Error("Trop de tentatives. Réessaie dans 15 minutes.");
        if(data.error)throw new Error("Pseudo ou clé incorrecte.");
        writeSession({username:data.username,token:data.session_token,revision:Number(data.save_revision)||0});
        applySnapshot(data.save_data||{});localStorage.setItem(HASH_KEY,snapshotHash(data.save_data||{}));
        window.location.reload();
    }catch(error){lastMessage=error.message||"Pseudo ou clé incorrecte.";busy=false;render()}
}
async function sync(silent=false){
    const session=readSession();if(!configured||!session||busy)return;
    busy=true;if(!silent)lastMessage="";render();
    try{
        const remote=await rpc("get_draconia_save",{p_session_token:session.token});
        const local=gameSnapshot(),localHash=snapshotHash(local),lastHash=localStorage.getItem(HASH_KEY),remoteHash=snapshotHash(remote.save_data||{});
        const remoteRevision=Number(remote.save_revision)||0;
        if(localHash!==lastHash&&remoteRevision===Number(session.revision||0)){
            const result=await rpc("save_draconia_progress",{p_session_token:session.token,p_save:local,p_expected_revision:remoteRevision});
            session.revision=Number(result.save_revision);writeSession(session);localStorage.setItem(HASH_KEY,localHash);lastMessage="Progression sauvegardée.";
        }else if(remoteRevision>Number(session.revision||0)&&localHash!==lastHash){
            localStorage.setItem(BACKUP_KEY,JSON.stringify({date:new Date().toISOString(),save:local}));
            session.revision=remoteRevision;writeSession(session);applySnapshot(remote.save_data||{});localStorage.setItem(HASH_KEY,remoteHash);
            alert("Une progression plus récente a été trouvée en ligne. La progression locale conflictuelle a été conservée en sauvegarde de sécurité.");
            window.location.reload();return;
        }else if(remoteHash!==localHash){
            session.revision=remoteRevision;writeSession(session);applySnapshot(remote.save_data||{});localStorage.setItem(HASH_KEY,remoteHash);window.location.reload();return;
        }else{
            session.revision=remoteRevision;writeSession(session);localStorage.setItem(HASH_KEY,localHash);if(!silent)lastMessage="Progression déjà à jour.";
        }
    }catch(error){if(!silent)lastMessage="Synchronisation impossible pour le moment. Ta progression reste sur cet appareil."}
    busy=false;render();
}
async function rotateKey(){
    const session=readSession();if(!session||busy)return;
    const key=generateKey();busy=true;render();
    try{await rpc("rotate_draconia_key",{p_session_token:session.token,p_new_secret_key:key});busy=false;showKey(session.username,key,"Nouvelle clé créée")}
    catch(error){busy=false;lastMessage="Impossible de renouveler la clé.";render()}
}
function logout(){writeSession(null);localStorage.removeItem(HASH_KEY);lastMessage="Déconnexion réussie. La sauvegarde locale reste sur cet appareil.";render()}
async function copyKey(){
    const key=document.getElementById("generated-account-key")?.textContent||"";
    try{await navigator.clipboard.writeText(key);lastMessage="Clé copiée."}catch{lastMessage="Maintiens ton doigt sur la clé pour la copier."}
}
function finishKey(){lastMessage="Compte connecté et sauvegarde activée.";render()}
window.draconiaCreateAccount=createAccount;window.draconiaLogin=login;window.draconiaSyncAccount=()=>sync(false);window.draconiaRotateKey=rotateKey;window.draconiaLogout=logout;window.draconiaCopyKey=copyKey;window.draconiaFinishKey=finishKey;
function start(){
    render();
    if(readSession()&&configured){sync(true);syncTimer=setInterval(()=>sync(true),20000)}
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)sync(true)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
