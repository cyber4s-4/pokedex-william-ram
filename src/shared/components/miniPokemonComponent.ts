import Pokemon from "../utils/pokemon";
import IComponent from "./IComponent";
import { htmlToElement } from "../utils/templateBuilder";

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
            `<div class="pokemon-container" id="{id}">
                <div class="pokemon-id">#{id}</div>
            <div class="pokemon-name">{name}</div>
                <img src="{img}"  class="pokemon-img">
            </div>`;
    }

    render(): void {
        let finalTemplate = this.template;
        finalTemplate = finalTemplate.replace('{id}', this.pokemonData.basicInfo.id);
        finalTemplate = finalTemplate.replace('{id}', this.pokemonData.basicInfo.id);
        finalTemplate = finalTemplate.replace('{name}', this.pokemonData.basicInfo.name);
        finalTemplate = finalTemplate.replace('{img}', this.pokemonData.basicInfo.img);
        const element = htmlToElement(finalTemplate);
        element.addEventListener('click', () => {
            window.location.href = "pokemon.html?id=" + this.pokemonData.basicInfo.id;
        });
        this.parentElement.appendChild(element);
    }

    update(data: Pokemon): void {
        this.pokemonData = data;
    }

}