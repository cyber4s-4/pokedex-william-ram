import basicPokemonComponent from "../components/basicPokemonComponent";
import Pokemon from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class MainPage extends PageHandler {

    // Responsible for loading more pokemons.
    private currentRenderedComponents: number;

    // Search related variables.
    private isSearchMode: boolean;
    private isCurrentlyLoading: boolean;
    private renderedSearchElements: number;
    private pokemonSearchIndexes: number[];

    constructor() {
        super();
        this.isCurrentlyLoading = false;
        this.currentRenderedComponents = 0;
        this.isSearchMode = false;
        this.renderedSearchElements = 0;
        this.pokemonSearchIndexes = [];
        this.buildPage();
    }

    private async buildPage(): Promise<void> {
        // Waits before generating any components.
        this.pokemonsStorage = (await (await fetch(`http://127.0.0.1:4000/json?limit=10000&offset=${this.pokemonsStorage.length}`)).json())['data'];
        this.generateBasicPokemonList();
        this.pullDataFromServer();

        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        this.renderComponents(pokemonListContainer, false, this.currentRenderedComponents, 20);
        this.currentRenderedComponents += 20;
    }

    public renderMore(): void {
        if (this.isSearchMode === true) {
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
            }, 500);
        }
    }

    private async pullDataFromServer() {
        let response;
        do {
            response = (await (await fetch(`http://127.0.0.1:4000/json?limit=10000&offset=${this.pokemonsStorage.length}`)).json());     
            if (response['isDone'] === true) {
                break;
            }
            this.pokemonsStorage = this.pokemonsStorage.concat(response['data']);
            this.generateBasicPokemonList();
        }while(response['isDone'] !== true)
        
    }

    private generateBasicPokemonList(): void {
        const pokemonListContainer = document.getElementById('container') as HTMLDivElement;
        for (let i = this.components.length; i < this.pokemonsStorage.length; i++) {
            this.createComponent(pokemonListContainer, this.pokemonsStorage[i]);
        }
    }

    private createComponent(parentContainer: HTMLDivElement, pokemonData: Pokemon) {
        this.components.push(new basicPokemonComponent(parentContainer, pokemonData));
    }

    public handleSearchBar(e: Event): void {
        (document.getElementById('not-found') as HTMLDivElement).style.visibility = 'hidden';
        const searchContent = (e.target as HTMLInputElement).value.trim();
        if (searchContent === '') {
            this.currentRenderedComponents = 0;
            this.isSearchMode = false;
            this.renderComponents(document.getElementById('container') as HTMLDivElement, true, this.currentRenderedComponents, 20);
            this.currentRenderedComponents = 20;
        } else {
            this.isSearchMode = true;
            (document.getElementById('container') as HTMLDivElement).innerHTML = '';
            this.pokemonSearchIndexes = [];
            this.pokemonsStorage.forEach((pokemonData, i) => {
                if (pokemonData.basicInfo.name.toLowerCase().includes(searchContent.toLowerCase()) || pokemonData.basicInfo.id.includes(searchContent)) {
                    this.pokemonSearchIndexes.push(i);                    
                }
            });
            
            this.renderedSearchElements = 0;
            for (let i = this.renderedSearchElements; i < this.renderedSearchElements + 20; i++) {
                if(this.pokemonSearchIndexes[i] === undefined) {
                    break;
                }
                this.components[this.pokemonSearchIndexes[i]].render();
            }
            this.renderedSearchElements += 20;
            if (this.pokemonSearchIndexes.length === 0) {
                (document.getElementById('not-found') as HTMLDivElement).style.visibility = 'visible';
                return;
            }
        }
    }
    public renderSearch() {
        if (this.isSearchMode === false) {
            return;
        }
        const amount = 20; // Edit this to control the amount of elements to render after the first render.
        if (window.innerHeight + document.documentElement.scrollTop + 50 > document.scrollingElement!.scrollHeight && this.isCurrentlyLoading === false) {
            this.isCurrentlyLoading = true;
            window.setTimeout(() => {
                for (let i = this.renderedSearchElements; i < this.renderedSearchElements + amount; i++) {
                    if(this.pokemonSearchIndexes[i] === undefined) {
                        break;
                    }
                    this.components[this.pokemonSearchIndexes[i]].render();
                }
                this.renderedSearchElements += amount;
                this.isCurrentlyLoading = false;
            }, 500);
        }


    }
}