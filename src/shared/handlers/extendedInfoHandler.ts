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
        if (this.isPokemonBasicInfo(id)) {
            const pokemonJSON = (await (await fetch('https://pokeapi.co/api/v2/pokemon/' + id)).json());
            const pokemon = this.getPokemonById(id);
            pokemon.abilities = [];
            pokemon.stats = [];
            pokemon.types = [];
            for (const abilityJSON of pokemonJSON['abilities']) {
                pokemon.abilities.push(abilityJSON['ability']['name']);
            }
            for (const statJSON of pokemonJSON['stats']) {
                pokemon.stats.push(new Stat(statJSON['stat']['name'], statJSON['base_stat']))
            }
            for (const typeJSON of pokemonJSON['types']) {
                pokemon.types.push(typeJSON['type']['name']);
            }
            pokemon.height = (Number(pokemonJSON['height']) / 10).toString() + 'm';
            pokemon.weight = (Number(pokemonJSON['weight']) / 10).toString() + 'kg';
            console.log(pokemonJSON['sprites']['other']['official-artwork']['front_default']);
            if (pokemonJSON['sprites']['other']['official-artwork']['front_default'] !== null) {
                pokemon.largeImg = pokemonJSON['sprites']['other']['official-artwork']['front_default'];
            }
            else pokemon.largeImg = pokemon.basicInfo.img;

            const pokemonComponent = new PokemonComponent(document.getElementById('container') as HTMLDivElement, pokemon);
            pokemonComponent.render();
            this.updateLocalStorage();
        } else {
            const pokemon = this.getPokemonById(id);
            const pokemonComponent = new PokemonComponent(document.getElementById('container') as HTMLDivElement, pokemon);
            pokemonComponent.render();
        }
    }
}
