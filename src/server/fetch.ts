import { BasicPokemonInfo, Stat, Pokemon } from "./pokemon";
import * as fs from "fs";
import fetch from "node-fetch";
import * as path from "path";

// Whenever a user enters to a pokemon info page it first searches if it exists locally and if not fetches from the server
// and updates locally.
export async function fetchExtendedInfoByID(id: string) {
    const pokemonJSON = (await (
        await fetch("https://pokeapi.co/api/v2/pokemon/" + id)
    ).json()) as any;
    let pokemonName = pokemonJSON["name"];
    pokemonName = pokemonName.replace(
        pokemonName[0],
        pokemonName[0].toUpperCase()
    );
    const pokemon = new Pokemon(
        new BasicPokemonInfo(
            id,
            pokemonName,
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        )
    );
    pokemon.abilities = [];
    pokemon.stats = [];
    pokemon.types = [];
    for (const abilityJSON of pokemonJSON["abilities"]) {
        pokemon.abilities.push(abilityJSON["ability"]["name"]);
    }
    for (const statJSON of pokemonJSON["stats"]) {
        pokemon.stats.push(
            new Stat(statJSON["stat"]["name"], statJSON["base_stat"])
        );
    }
    for (const typeJSON of pokemonJSON["types"]) {
        const typeWithCapital = typeJSON["type"]["name"].replace(
            typeJSON["type"]["name"][0],
            typeJSON["type"]["name"][0].toUpperCase()
        );
        pokemon.types.push(typeWithCapital);
    }
    pokemon.height = (Number(pokemonJSON["height"]) / 10).toString();
    pokemon.weight = (Number(pokemonJSON["weight"]) / 10).toString();
    if (
        pokemonJSON["sprites"]["other"]["official-artwork"]["front_default"] !==
        null
    ) {
        pokemon.largeImg =
            pokemonJSON["sprites"]["other"]["official-artwork"]["front_default"];
    } else pokemon.largeImg = pokemon.basicInfo.img;
    globalThis.pokemonsJson.push(pokemon);
}

export async function fetchAllExtended() {
    if (fs.existsSync(path.join(__dirname, "/pokemonsData.json"))) {
        globalThis.pokemonsJson = JSON.parse(
            fs.readFileSync(path.join(__dirname, "/pokemonsData.json")).toString()
        );
    } else {
        for (let i = 1; i < 899; i++) {
            await fetchExtendedInfoByID(i.toString(10));
        }
        fs.writeFileSync(
            path.join(__dirname, "/pokemonsData.json"),
            JSON.stringify(globalThis.pokemonsJson)
        );
    }

}

export function getPokemonById(id: string) {
    return globalThis.pokemonsJson.find((pokemon) => pokemon.basicInfo.id == id);
}
