import ExtendedInfoHandler from "./shared/handlers/extendedInfoHandler";
import MainPage from "./shared/handlers/mainPageHandler";


window.addEventListener('load', (e) => {
  if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
    const handler = new MainPage();
    document.getElementById('search-input')?.addEventListener('input',(e) => handler.handleSearchBar(e))
  }
  else if (window.location.pathname === "/pokemon.html") {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
      const id: string = urlParams.get('id')!;
      const handler = new ExtendedInfoHandler(id);
    }
    else {
      window.location.href = "index.html";
    }
  }

});
