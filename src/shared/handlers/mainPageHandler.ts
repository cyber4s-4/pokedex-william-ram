import IComponent from "../components/IComponent";
import { Pokemon } from "../utils/pokemon";

export default class MainPage {
     
    private pokemonComponents: IComponent[];
    private pokemonsData: Pokemon[];
    constructor() {
        this.pokemonComponents = [];
        this.pokemonsData = [];
    }
    
    public async generateBasicPokemonList(): Promise<void> {
        const pokemonsJSONList = await (await fetch('https://pokeapi.co/api/v2/pokemon/pokemon/?limit=905')).json();
        for(let result of pokemonsJSONList['results']){
            const pokemonJson = await (await fetch(result['url'])).json();
            this.newPokemonFromJson(pokemonJson);
        }
    }
    private newPokemonFromJson(pokemonJson: object) {
       
    }
    
}