import IComponent from '../components/IComponent';
import Pokemon, { BasicPokemonInfo } from '../utils/pokemon';

export default class PageHandler {
    // An array of components that are built inside extending class pages.
    protected components: IComponent[];
    protected pokemonsStorage: Pokemon[];
    constructor() {
        this.components = [];
        this.pokemonsStorage = [];
        this.fetchBasicPokemonData().then((data) => this.pokemonsStorage = data);
    }

    private async fetchBasicPokemonData(): Promise<Pokemon[]> {
        let pokemonsArray: Pokemon[] = [];
        // https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0 -> To get a list of all the pokemons
        // Maybe cache on the fly whenever an user clicks on a pokemon, if it's not existing on their local storage
        // Make a fetch and add it to the local storage?
        const spriteLink = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png';
        if (localStorage.getItem('pokedex') === null) {
            const pokemonsList =  (await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=906&offset=0')).json());
            for(let i = 1; i < 906; i++) {
                const pokemonImgLink = spriteLink.replace('{id}', i.toString());
                const pokemon = pokemonsList['results'][i];
                pokemonsArray.push(new Pokemon(new BasicPokemonInfo(i.toString(), pokemon['name'], pokemonImgLink)));
            }
            localStorage.setItem('pokedex', JSON.stringify(pokemonsArray));
        } else {
            pokemonsArray = (JSON.parse(localStorage.getItem('pokedex') || '{}') as Pokemon[]);
        }
        return pokemonsArray;
    }

    protected updateLocalStorage(): void {
        localStorage.setItem('pokedex', JSON.stringify(this.pokemonsStorage));
    }

    protected getPokemonById(id: string): Pokemon {
        return this.pokemonsStorage.find((pokemonData) => pokemonData.basicInfo.id === id) || new Pokemon(new BasicPokemonInfo('-1', 'Not found', ''));
    }

    protected isPokemonBasicInfo(id: string): boolean {
        return this.getPokemonById(id).abilities === undefined;
    }

    protected renderComponents(parentElement: HTMLElement): void {
        parentElement.innerHTML = '';
        this.components.forEach((component) => component.render());
    }
}
