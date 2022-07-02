import MiniPokemonComponent from "../components/miniPokemonComponent";
import Pokemon from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class MainPage extends PageHandler {

    constructor() {
        super();
        this.generateBasicPokemonList();
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.renderComponents(pokemonListContainer);
    }

    public generateBasicPokemonList(): void {
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.pokemonsStorage.forEach((pokemonData) => this.createComponent(pokemonListContainer, pokemonData));
    }
    private createComponent(parentContainer: HTMLDivElement, pokemonData: Pokemon) {
        this.components.push(new MiniPokemonComponent(parentContainer, pokemonData));
    }

    public handleSearchBar(e: Event): void {
        const searchContent = (e.target as HTMLInputElement).value.trim();

        if (searchContent === '') {
            this.renderComponents(document.getElementById('container') as HTMLDivElement);
        } else {
            (document.getElementById('container') as HTMLDivElement).innerHTML = '';
            this.pokemonsStorage.forEach((pokemonData, i) => {
                if (pokemonData.basicInfo.name.toLowerCase().includes(searchContent.toLowerCase())) {
                    this.components[i].render();
                }
            });
        }
    }

}