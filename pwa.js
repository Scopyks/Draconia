// DRACONIA - MISE À JOUR DE L'APPLICATION INSTALLÉE
(function(){
if(!("serviceWorker" in navigator))return;
let refreshing=false;
navigator.serviceWorker.addEventListener("controllerchange",()=>{
    if(refreshing)return;
    refreshing=true;
    window.location.reload();
});
window.addEventListener("load",async()=>{
    try{
        const registration=await navigator.serviceWorker.register("./service-worker.js?v=8",{updateViaCache:"none"});
        await registration.update();
        setInterval(()=>registration.update(),15*60*1000);
        document.addEventListener("visibilitychange",()=>{if(!document.hidden)registration.update();});
    }catch(error){
        console.warn("Mise à jour hors ligne indisponible.",error);
    }
},{once:true});
})();
