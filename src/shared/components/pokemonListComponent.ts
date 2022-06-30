import { Pokemon } from "../utils/pokemon";
import IComponent from "./IComponent";

/**
 * This is a component meant to be used for the main Pokemons list.
 * Contains basic information about the Pokemons.
 */
export default class PokemonListComponent implements IComponent {
    parentElement: HTMLElement;
    pokemonData: Pokemon;
    template: string;
    constructor(parentElement: HTMLElement, pokemonData: Pokemon) {
        this.parentElement = parentElement;
        this.pokemonData = pokemonData;

        this.template = '';
    }

    render(): void {
        throw new Error("Method not implemented.");
    }
    update(data: Pokemon): void {
        this.pokemonData = data;
    }
    
}