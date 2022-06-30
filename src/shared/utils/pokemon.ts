export class Pokemon {
    constructor(
        public id: string,
        public name: string,
        public stats: Stat[],
        public abilities: Ability[],
        public height: string,
        public weight: string,
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
