import Pokemon from "../utils/pokemon";
import PageHandler from "./pageHandler";

export default class extendedInfoHandler extends PageHandler {
    constructor(id:string) {
        super();
        this.fetchExtendedInfo(id);
    }

    /**
     * A function that fetches the extended information of the pokemon, updates the pokemon data array
     * and calls the update function for the local storage
     * @param id The ID of the pokemon we want to update
     */
    
    private async fetchExtendedInfo(id: string): Promise<void> {
        // TODO: Check if the info is basic via PageHandler.isPokemonBasicInfo, if so make the fetch,
        // else pull the data from the data array and construct the PokemonComponent to the page and call
        // PageHandler.updateLocalStorage to make the entry cached.
    }
}
