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
        // TODO: Decide the name of the list container for the basic Pokemon list.
        // TODO: Decide if the container is a list or a div.
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.pokemonsStorage.forEach((pokemonData) => this.createComponent(pokemonListContainer, pokemonData));
    }
    private createComponent(parentContainer: HTMLDivElement, pokemonData: Pokemon) {
        this.components.push(new MiniPokemonComponent(parentContainer, pokemonData));
    }

}