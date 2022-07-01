export default class Pokemon {
    constructor(
        public basicInfo: BasicPokemonInfo,
        public stats?: Stat[],
        public abilities?: Ability[],
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
        public baseStat: number,
        public name: string
    ) { }
}

export class Ability {
    constructor(
        public name: string,
        public effect: string
    ) { }
}
