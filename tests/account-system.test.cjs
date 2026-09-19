const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('account.js','utf8'),sql=fs.readFileSync('supabase/schema.sql','utf8'),html=fs.readFileSync('index.html','utf8');
const configSource=fs.readFileSync('config.js','utf8');
assert(configSource.includes('supabaseUrl: ""'));assert(configSource.includes('supabaseAnonKey: ""'));
assert(html.includes('id="account-panel"'));assert(html.includes('account.js?v=1'));
assert(source.includes('crypto.getRandomValues'));assert(source.includes('type="password"'));
assert(source.includes('create_draconia_account'));assert(source.includes('login_draconia_account'));
assert(source.includes('p_expected_revision'));assert(source.includes('draconiaCloudConflictBackupV1'));
assert(source.includes('startsWith("draconia")'));assert(!source.includes('localStorage.setItem("secret'));
assert(sql.includes("crypt(p_secret_key, gen_salt('bf', 12))"));assert(sql.includes("digest(p_session_token, 'sha256')"));
assert(sql.includes('enable row level security'));assert(sql.includes('save_revision = p_expected_revision'));
assert(sql.includes("failed_attempts + 1 >= 5"));assert(sql.includes("interval '15 minutes'"));
assert(sql.includes("return jsonb_build_object('error', 'RATE_LIMITED')"),'le verrouillage doit être validé sans rollback SQL');
assert(sql.includes('revoke all on public.draconia_accounts'));
const c={DraconiaConfig:{cloud:{supabaseUrl:'',supabaseAnonKey:''}},localStorage:{length:0,getItem(){return null},setItem(){},removeItem(){},key(){return null}},
 document:{readyState:'loading',getElementById(){return null},addEventListener(){},head:{appendChild(){}}},window:null,setInterval(){},fetch(){throw Error('pas de réseau sans configuration')}};c.window=c;
vm.createContext(c);vm.runInContext(source,c);
assert.equal(typeof c.draconiaCreateAccount,'function');assert.equal(typeof c.draconiaLogin,'function');assert.equal(typeof c.draconiaSyncAccount,'function');assert.equal(typeof c.draconiaRotateKey,'function');assert.equal(typeof c.draconiaLogout,'function');
console.log('Comptes : configuration publique, clé aléatoire, RPC, RLS, hachage, verrouillage, conflits et interface OK');
