import { BasicPokemonInfo, Stat, Pokemon } from "./pokemon";
import { Client } from "pg";


export default class PokeDB {
    private client: Client | undefined;
    constructor() {
        this.client = undefined;
        this.create();
    }

    /**
     * Creates a client object
     * @returns The client object
     */
    private async create(): Promise<void> {
        this.client = new Client({
            connectionString:
            process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    /**
     * Connects to the database and creates the table if needed.
     */
    public async connect(): Promise<void> {
        await this.client!.connect();
        let query: string;
        query = `CREATE TABLE IF NOT EXISTS pokemons (
            id	VARCHAR(255) NOT NULL UNIQUE,
            pokemonName	VARCHAR(255) NOT NULL,
            img	VARCHAR(255) NOT NULL,
            stats	JSON,
            abilities	JSON,
            height	VARCHAR(255),
            weight	VARCHAR(255),
            largeImg	VARCHAR(255),
            types	JSON,
              PRIMARY KEY(id)
            );`;
        await this.client!.query(query);
    }

    public async insertData(pokemons: Pokemon[]) {
        let query = `INSERT INTO pokemons (id, pokemonName, img, stats, abilities, height, weight, largeImg, types) VALUES `;
        const pokemonsValues = [];
        for (let i = 0; i < pokemons.length; i++) {
            if (i !== 0) {
                query = query.concat(",");
            }
            pokemonsValues.push(
                pokemons[i].basicInfo.id,
                pokemons[i].basicInfo.name,
                pokemons[i].basicInfo.img,
                JSON.stringify(pokemons[i].stats),
                JSON.stringify(pokemons[i].abilities),
                pokemons[i].height,
                pokemons[i].weight,
                pokemons[i].largeImg,
                JSON.stringify(pokemons[i].types)
            );
            const offset = i * 9;
            query = query.concat(
                `($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4},$${offset + 5},$${offset + 6},$${offset + 7},$${offset + 8},$${offset + 9})`
            );
        }
        query.concat(";");

        await this.client!.query(query, pokemonsValues);
    }

    public async getPokemonsFromDb(): Promise<Pokemon[]> {
        const query: string = "SELECT * FROM pokemons;";
        const pokemonsArray: Pokemon[] = [];
        const results = (await this.client!.query(query)).rows;
        console.log(results);

        for (let i = 0; i < results.length; i++) {
            pokemonsArray.push(
                new Pokemon(
                    new BasicPokemonInfo(results[i].id, results[i].pokemonname, results[i].img),
                    results[i].stats,
                    results[i].abilities,
                    results[i].height,
                    results[i].weight,
                    results[i].largeimg,
                    results[i].types
                )
            );
        }
        console.log(pokemonsArray);
        return pokemonsArray;
    }
}

// Those functions aren't being called because we are not using fusions.

export async function createMergedPokemons(
    pokemonsToMergeArray: Pokemon[],
    client: Client
): Promise<Pokemon[]> {
    const length = pokemonsToMergeArray.length;
    let mergedPokemonsArray = [];
    let count = (await (
        await client.query("SELECT count(id) FROM pokemons;")
    ).rows[0]) as number;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (i != j) {
                const mergedPokemon = mergePokemons(
                    pokemonsToMergeArray[i],
                    pokemonsToMergeArray[j],
                    count
                );
                mergedPokemonsArray.push(mergedPokemon);
                count++;
            }
        }
    }
    return mergedPokemonsArray;
}

function mergePokemons(pokemon1: Pokemon, pokemon2: Pokemon, count: number): Pokemon {
    const name: string = pokemon1.basicInfo.name + "|" + pokemon2.basicInfo.name;
    const id: string = (count + 1).toString();
    const img: string = `https://raw.githubusercontent.com/Aegide/autogen-fusion-sprites/master/Battlers/${pokemon1.basicInfo.id}/${pokemon1.basicInfo.id}.${pokemon2.basicInfo.id}.png`;
    let basicInfo: BasicPokemonInfo = new BasicPokemonInfo(id, name, img);
    const abilities: string[] = [pokemon1.abilities![0], pokemon2.abilities![0]];
    const height: string = (
        Number(pokemon1.height) +
        Number(pokemon2.height) / 2
    ).toString();
    const weight: string = (
        Number(pokemon1.weight) +
        Number(pokemon2.weight) / 2
    ).toString();
    //add all the unique pokemon types
    const types: string[] = [];
    pokemon1.types?.forEach((type) => types.push(type));
    pokemon2.types?.forEach((type) => {
        if (!types.includes(type)) {
            types.push(type);
        }
    });
    let stats: Stat[] = [];
    for (let i = 0; i < pokemon1.stats!.length; i++) {
        const statName = pokemon1.stats![i].name;
        const mergedBaseStat = (
            (Number(pokemon1.stats![i].baseStat) +
                Number(pokemon2.stats![i].baseStat)) /
            2
        ).toString();
        stats.push(new Stat(statName, mergedBaseStat));
    }
    let mergedPokemon: Pokemon = new Pokemon(
        basicInfo,
        stats,
        abilities,
        height,
        weight,
        img,
        types
    );
    return mergedPokemon;
}
//----------------------------------------------------------------
