import basicPokemonComponent from "../components/basicPokemonComponent";
import Pokemon from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class MainPage extends PageHandler {

    // Responsible for loading more pokemons.
    private currentRenderedComponents: number;
    private isSearchMode: boolean;
    private isCurrentlyLoading: boolean;
    private renderedSearchElements: number; 
    constructor() {
        super();
        this.isCurrentlyLoading = false;
        this.currentRenderedComponents = 0;
        this.isSearchMode = false;
        this.renderedSearchElements = 0;
        this.buildPage();
    }

    private async buildPage(): Promise<void> {
        // Waits before generating any components.
        await this.pullDataFromServer();
        this.generateBasicPokemonList();
        
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.renderComponents(pokemonListContainer, false, this.currentRenderedComponents, 20);
        this.currentRenderedComponents += 20;
    }

    public renderMore(): void {
        if(this.isSearchMode === true) {
            return;
        }
        const amount = 20; // Edit this to control the amount of elements to render.
        if (window.innerHeight + document.documentElement.scrollTop + 50 > document.scrollingElement!.scrollHeight && this.isCurrentlyLoading === false) {
            this.isCurrentlyLoading = true;
            window.setTimeout(() => {
                const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
                this.renderComponents(pokemonListContainer, false, this.currentRenderedComponents, amount);
                this.currentRenderedComponents += amount;
                this.isCurrentlyLoading = false;
            }, 2000);
        }
        console.log(this.isCurrentlyLoading);
        
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
            this.currentRenderedComponents = 0;
            this.isSearchMode = false;
            window.removeEventListener('scroll', this.renderSearch);
            this.renderComponents(document.getElementById('container') as HTMLDivElement, true, this.currentRenderedComponents, 20);
        } else {
            this.isSearchMode = true;
            window.addEventListener('scroll', () => this.renderSearch());
            window.removeEventListener('scroll', this.renderMore);
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
    private renderSearch() {
        
    }
}