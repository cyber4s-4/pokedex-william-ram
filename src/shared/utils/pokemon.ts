export class Pokemon {
    constructor(
        public name: string,
        public stats: Stat[],
        public abilities: string[],
        public height: number,
        public weight: number,
        public img: string
    ) { }
}

class Stat {
    constructor(
        public baseStat: number,
        public name: string
    ) { }
}
