import ExtendedInfoHandler from "./shared/handlers/extendedInfoHandler";
import MainPage from "./shared/handlers/mainPageHandler";


window.addEventListener('load', (e) => {
  if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
    const handler = new MainPage();
    document.getElementById('search-input')?.addEventListener('input',(e) => handler.handleSearchBar(e))
  }
  else if (window.location.pathname === "/pokemon.html") {
    const urlParts = window.location.pathname.split('/');
    if (Number.isInteger(urlParts[urlParts.length - 1]) === true) {
      const id: string = urlParts[urlParts.length - 1];
      const handler = new ExtendedInfoHandler(id);
    }
    else {
      window.location.href = "index.html";
    }
  }

});
