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
        // https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0 -> To get a list of all the pokemons
        // Maybe cache on the fly whenever an user clicks on a pokemon, if it's not existing on their local storage
        // Make a fetch and add it to the local storage?
        const spriteLink = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png';
        if (localStorage.getItem('pokedex') === null) {
            const pokemonsList =  (await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=899&offset=0')).json());
            for(let i = 0; i < 898; i++) {
                const pokemonImgLink = spriteLink.replace('{id}', (i+1).toString());
                const pokemon = pokemonsList['results'][i];
                this.pokemonsStorage.push(new Pokemon(new BasicPokemonInfo((i+1).toString(), pokemon['name'], pokemonImgLink)));
            }
            localStorage.setItem('pokedex', JSON.stringify(this.pokemonsStorage));
        } else {
            this.pokemonsStorage = (JSON.parse(localStorage.getItem('pokedex') || '{}') as Pokemon[]);
        }      
        return this.pokemonsStorage;
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
        console.log(this.components);
        this.components.forEach((component) => component.render());
    }
}
