import Pokemon from "../utils/pokemon";
import IComponent from "./IComponent";

/**
 * This is a component meant to be used for the main Pokemons list.
 * Contains basic information about the Pokemons.
 */
export default class MiniPokemonComponent implements IComponent {
    parentElement: HTMLElement;
    pokemonData: Pokemon;
    template: string;
    constructor(parentElement: HTMLElement, pokemonData: Pokemon) {
        this.parentElement = parentElement;
        this.pokemonData = pokemonData;

        this.template =
            `<div class="pokemon-container" id="1">
                <div class="pokemon-id">#{id}</div>
            <div class="pokemon-name">{name}</div>
                <img src="{img}"  class="pokemon-img">
            </div>`;
    }

    render(): void {
        throw new Error("Method not implemented.");
    }
    update(data: Pokemon): void {
        this.pokemonData = data;
    }

}