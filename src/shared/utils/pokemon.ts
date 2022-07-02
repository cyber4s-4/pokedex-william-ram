export default class Pokemon {
    constructor(
        public basicInfo: BasicPokemonInfo,
        public stats?: Stat[],
        public abilities?: string[],
        public height?: string,
        public weight?: string
    ) { }
}

export class BasicPokemonInfo {
    constructor(
        public id: string,
        public name: string,
        public img: string) {
        //Convert first letter of the name to upper case
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
        console.log(this.name);
    }
}

export class Stat {
    constructor(
        public name: string,
        public baseStat: string
    ) { }
}
