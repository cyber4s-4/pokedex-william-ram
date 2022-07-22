import { MongoClient, Db, Collection/*, WithId*/ } from 'mongodb';
import { BasicPokemonInfo, Stat, Pokemon } from './pokemon';
import { Client } from 'pg';

/**
 * Creates a client object
 * @returns The client object
 */
export async function create() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    return client;
}

/**
 * Connects to the database and creates the table if needed.
 * @param client 
 * @returns 
 */
export async function connect(client: Client) {
    await client.connect();
    let query: string;
    query = `CREATE TABLE IF NOT EXISTS agents (
        id	SERIAL UNIQUE,
        name	VARCHAR(255) NOT NULL,
        img	VARCHAR(255) NOT NULL,
        name	VARCHAR(255),
        baseStat	VARCHAR(255),
        height	VARCHAR(255),
        weight	VARCHAR(255),
        largeImg	VARCHAR(255),
        types	VARCHAR(255),
          PRIMARY KEY(id)
        );`
    await client.query(query);
}

export async function createMergedPokemons(pokemonsToMergeArray: Pokemon[], collection: Collection): Promise<Pokemon[]> {
    const length = pokemonsToMergeArray.length;
    let mergedPokemonsArray = [];
    let count = await collection.count({});
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (i != j) {
                const mergedPokemon = (mergePokemons(pokemonsToMergeArray[i], pokemonsToMergeArray[j], count));
                mergedPokemonsArray.push(mergedPokemon);
                count++;
            }
        }
    }
    return mergedPokemonsArray;
}

function mergePokemons(pokemon1: Pokemon, pokemon2: Pokemon, count: number): Pokemon {
    const name: string = pokemon1.basicInfo.name + '|' + pokemon2.basicInfo.name;
    const id: string = (count + 1).toString();
    const img: string = `https://raw.githubusercontent.com/Aegide/autogen-fusion-sprites/master/Battlers/${pokemon1.basicInfo.id}/${pokemon1.basicInfo.id}.${pokemon2.basicInfo.id}.png`;
    let basicInfo: BasicPokemonInfo = new BasicPokemonInfo(id, name, img);
    const abilities: string[] = [pokemon1.abilities![0], pokemon2.abilities![0]];
    const height: string = (Number(pokemon1.height) + Number(pokemon2.height) / 2).toString();
    const weight: string = (Number(pokemon1.weight) + Number(pokemon2.weight) / 2).toString();
    //add all the unique pokemon types
    const types: string[] = [];
    pokemon1.types?.forEach(type => types.push(type));
    pokemon2.types?.forEach(type => {
        if (!types.includes(type)) {
            types.push(type);
        }
    });
    let stats: Stat[] = [];
    for (let i = 0; i < pokemon1.stats!.length; i++) {
        const statName = pokemon1.stats![i].name;
        const mergedBaseStat = ((Number(pokemon1.stats![i].baseStat) + Number(pokemon2.stats![i].baseStat)) / 2).toString();
        stats.push(new Stat(statName, mergedBaseStat));
    }
    let mergedPokemon: Pokemon = new Pokemon(basicInfo, stats, abilities, height, weight, img, types);
    return mergedPokemon;
}

export async function getPokemonsFromAtlas(collection: Collection): Promise<Pokemon[]> {
    return await collection.find({}).toArray() as unknown as Pokemon[];
}
