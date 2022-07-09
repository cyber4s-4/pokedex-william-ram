import IComponent from '../components/IComponent';
import Pokemon, { BasicPokemonInfo } from '../utils/pokemon';

export default class PageHandler {
    // An array of components that are built inside extending class pages.
    protected components: IComponent[];
    protected pokemonsStorage: Pokemon[];
    constructor() {
        this.components = [];
        this.pokemonsStorage = [];
    }

    protected async pullDataFromServer() {
        this.pokemonsStorage = await (await fetch('http://127.0.0.1:4000/json')).json(); 
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
