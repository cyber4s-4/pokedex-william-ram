"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stat = exports.BasicPokemonInfo = void 0;
class Pokemon {
    constructor(basicInfo, stats, abilities, height, weight, largeImg, types) {
        this.basicInfo = basicInfo;
        this.stats = stats;
        this.abilities = abilities;
        this.height = height;
        this.weight = weight;
        this.largeImg = largeImg;
        this.types = types;
    }
}
exports.default = Pokemon;
class BasicPokemonInfo {
    constructor(id, name, img) {
        this.id = id;
        this.name = name;
        this.img = img;
    }
}
exports.BasicPokemonInfo = BasicPokemonInfo;
class Stat {
    constructor(name, baseStat) {
        this.name = name;
        this.baseStat = baseStat;
    }
}
exports.Stat = Stat;