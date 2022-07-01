import PokemonComponent from "../components/pokemonComponent";
import { Stat } from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class extendedInfoHandler extends PageHandler {

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
        // TODO: Check if the info is basic via PageHandler.isPokemonBasicInfo, if so make the fetch,
        // else pull the data from the data array and construct the PokemonComponent to the page and call
        // PageHandler.updateLocalStorage to make the entry cached.
        if (this.isPokemonBasicInfo(id)) {
            const pokemonJSON = (await (await fetch('https://pokeapi.co/api/v2/pokemon/' + id)).json());
            let pokemon = this.getPokemonById(id);
            pokemon.abilities = [];
            pokemon.stats = [];
            for (const abilityJSON of pokemonJSON['abilities']) {
                pokemon.abilities.push(abilityJSON['ability']['name']);
            }
            for (const statJSON of pokemonJSON['stats']) {
                pokemon.stats.push(new Stat(statJSON['stat']['name'] , statJSON['base_stat']))
            }
            pokemon.height = pokemonJSON['height'];
            pokemon.weight = pokemonJSON['weight'];
            console.log( pokemon.abilities,  pokemon.stats);
            const pokemonComponent = new PokemonComponent(document.getElementById('container') as HTMLDivElement , pokemon);
            pokemonComponent.render();
        }
    }
}
