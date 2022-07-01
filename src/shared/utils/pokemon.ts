export default class Pokemon {
    constructor(
        public basicInfo: BasicPokemonInfo,
        public stats?: Stat[],
        public abilities?: string[],
        public height?: string,
        public weight?: string,
    ) { }
}

export class BasicPokemonInfo {
    constructor (
        public id: string,
        public name: string,
        public img: string
    ) { }
}

export class Stat {
    constructor(
        public name: string,
        public baseStat: string
    ) { }
}
