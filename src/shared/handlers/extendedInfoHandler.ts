import PokemonComponent from "../components/pokemonComponent";
import PageHandler from "./pageHandler";

export default class ExtendedInfoHandler extends PageHandler {

    constructor(id: string) {
        super();
        this.buildPage(id);
    }

    private async buildPage(id: string): Promise<void> {  
        await this.pullDataFromServer();
        await this.fetchExtendedInfo(id);
    }

    /**
     * A function that fetches the extended information of the pokemon, updates the pokemon data array
     * and renders the pokemon component.
     * @param id The ID of the pokemon we want to update
     */
    private async fetchExtendedInfo(id: string): Promise<void> {
        if (this.getPokemonById(id)) {
            let pokemon = this.getPokemonById(id);
            
            if (this.isPokemonBasicInfo(id)) {
                this.pokemonsStorage = (await (await fetch(`http://127.0.0.1:4000/update/${id}`)).json());
                pokemon = this.getPokemonById(id);
            }
            const pokemonComponent = new PokemonComponent(document.getElementById('container') as HTMLDivElement, pokemon);
            pokemonComponent.render();
        }
        else window.location.href = "http://locahost:4000/";
    }
}
