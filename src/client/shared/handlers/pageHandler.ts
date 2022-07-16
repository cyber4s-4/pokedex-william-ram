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

    protected updateLocalStorage(): void {
        localStorage.setItem('pokedex', JSON.stringify(this.pokemonsStorage));
    }

    protected getPokemonById(id: string): Pokemon {
        return this.pokemonsStorage.find((pokemonData) => pokemonData.basicInfo.id === id) || new Pokemon(new BasicPokemonInfo('-1', 'Not found', ''));
    }

    protected isPokemonBasicInfo(id: string): boolean {
        return this.getPokemonById(id).abilities === undefined;
    }

    protected renderComponents(parentElement: HTMLElement, resetParent: boolean, currentRenderedComponents?: number, limiter?: number): void {
        if (resetParent === true) {
            parentElement.innerHTML = '';
        }
        if (limiter === undefined) {
            this.components.forEach((component) => component.render());
        } else {
            for (let i = currentRenderedComponents; i! < currentRenderedComponents! + limiter; i!++) {
                if(this.components[i!] === undefined) {
                    break;
                }
                this.components[i!].render();
            }
        }
    }
}
