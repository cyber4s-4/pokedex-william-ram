import IComponent from '../components/IComponent';
import Pokemon, { BasicPokemonInfo } from '../utils/pokemon';

export default class PageHandler {
    // An array of components that are built inside extending class pages.
    protected components: IComponent[];
    protected pokemonsStorage: Pokemon[];
    constructor() {
        this.components = [];
        this.pokemonsStorage = [];
        this.fetchBasicPokemonData();
    }

    private async fetchBasicPokemonData(): Promise<void> {
        const spriteLink = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png';
        if (localStorage.getItem('pokedex') === null) {
            const pokemonsList = (await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=899&offset=0')).json());
            for (let i = 0; i < 898; i++) {
                const pokemonImgLink = spriteLink.replace('{id}', (i + 1).toString());
                const pokemon = pokemonsList['results'][i];
                let pokemonName = pokemon['name'];
                pokemonName = pokemonName.replace(pokemonName[0], pokemonName[0].toUpperCase());

                this.pokemonsStorage.push(new Pokemon(new BasicPokemonInfo((i + 1).toString(), pokemonName, pokemonImgLink)));
            }
            // Something is wrong with this line whenever it tries to save the data.
            localStorage.setItem('pokedex', JSON.stringify(this.pokemonsStorage));
        } else {
            this.pokemonsStorage = (JSON.parse(localStorage.getItem('pokedex') || '{}') as Pokemon[]);
        }
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
