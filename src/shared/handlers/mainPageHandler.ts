import basicPokemonComponent from "../components/basicPokemonComponent";
import Pokemon from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class MainPage extends PageHandler {

    constructor() {
        super();
        this.buildPage();
    }

    private async buildPage(): Promise<void> {
        // Waits before generating any components.
        await this.pullDataFromServer();
        this.generateBasicPokemonList();
        
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.renderComponents(pokemonListContainer);
    }

    private generateBasicPokemonList(): void {
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.pokemonsStorage.forEach((pokemonData) => this.createComponent(pokemonListContainer, pokemonData));
    }
    
    private createComponent(parentContainer: HTMLDivElement, pokemonData: Pokemon) {
        this.components.push(new basicPokemonComponent(parentContainer, pokemonData));
    }

    public handleSearchBar(e: Event): void {
        (document.getElementById('not-found') as HTMLDivElement).style.visibility = 'hidden';
        const searchContent = (e.target as HTMLInputElement).value.trim();
        let isEmpty:boolean = true;
        if (searchContent === '') {
            this.renderComponents(document.getElementById('container') as HTMLDivElement);
        } else {
            (document.getElementById('container') as HTMLDivElement).innerHTML = '';
            this.pokemonsStorage.forEach((pokemonData, i) => {
                if (pokemonData.basicInfo.name.toLowerCase().includes(searchContent.toLowerCase()) || pokemonData.basicInfo.id.includes(searchContent)) {
                    this.components[i].render();
                    isEmpty = false;
                }
            });
            if(isEmpty){
                (document.getElementById('not-found') as HTMLDivElement).style.visibility = 'visible';
            }
        }
    }

}