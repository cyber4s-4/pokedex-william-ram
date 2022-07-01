import extendedInfoHandler from "./shared/handlers/extendedInfoHandler";
import MainPage from "./shared/handlers/mainPageHandler";


window.addEventListener('load', (e) => {
  if (window.location.pathname === "index.html" || window.location.pathname === "/") {
    const handler = new MainPage();  
  }
  else if (window.location.pathname === "pokemon.html") {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('id')){
      const id:string = urlParams.get('id')!;
      const handler = new extendedInfoHandler(id);

    }
    else window.location.href = "index.html";
  }

});
