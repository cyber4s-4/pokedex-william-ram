import PokemonComponent from "../components/pokemonComponent";
import Pokemon, { Stat } from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class ExtendedInfoHandler extends PageHandler {

    constructor(id: string) {
        super();
        this.fetchExtendedInfo(id);
    }

    /**
     * A function that fetches the extended information of the pokemon, updates the pokemon data array
     * and calls the update function for the local storage
     * @param id The ID of the pokemon we want to update
     */

    private async fetchExtendedInfo(id: string): Promise<void> {
        if (this.isPokemonBasicInfo(id)) {
            let pokemon = this.getPokemonById(id);
            const extendedPokemonData = await (await fetch(`http://locahost:4000/update/${id}`)).json() as Pokemon;
            pokemon = extendedPokemonData;

        } else {
            const pokemon = this.getPokemonById(id);
            const pokemonComponent = new PokemonComponent(document.getElementById('container') as HTMLDivElement, pokemon);
            pokemonComponent.render();
        }
    }
}
