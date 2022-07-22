import { BasicPokemonInfo, Stat, Pokemon } from './pokemon';
import { Client } from 'pg';

// TODO: Transfer this file into a class for the express not caring if it's mongo or postgresql.

/**
 * Creates a client object
 * @returns The client object
 */
export async function create() {
    const client = new Client({
        connectionString: 'postgres://hhdyfrtcydaofk:1d38bbc5fb21fadac56e49d303e2a297febd2076112ba61063aa173b73c02145@ec2-34-235-31-124.compute-1.amazonaws.com:5432/deb63rabfhna07',
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
    query = `CREATE TABLE IF NOT EXISTS pokemons (
        id	SERIAL UNIQUE,
        pokemonName	VARCHAR(255) NOT NULL,
        img	VARCHAR(255) NOT NULL,
        statName	VARCHAR(255),
        baseStat	VARCHAR(255),
        height	VARCHAR(255),
        weight	VARCHAR(255),
        largeImg	VARCHAR(255),
        types	VARCHAR(255),
          PRIMARY KEY(id)
        );`
    await client.query(query);
}

export async function createMergedPokemons(pokemonsToMergeArray: Pokemon[], client: Client): Promise<Pokemon[]> {
    const length = pokemonsToMergeArray.length;
    let mergedPokemonsArray = [];
    let count = await (await client.query('SELECT count(id) FROM pokemons;')).rows[0] as number;
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

export async function insertData(client: Client, pokemons: Pokemon[]) {
    let query = `INSERT INTO pokemons (id, pokemonName, img, statName, baseStat, height, weight, largeImg, types) VALUES `;
    for (let i = 0; i <pokemons.length; i++) {
        if (i !== 0) {
            query = query.concat(',');
        }
        i++;
        const offset = i * 6;
        query = query.concat(`($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4},$${offset + 5},$${offset + 6})`);

    }
    await client.query(query.concat(';'), pokemons.flat());
}

// function paramaterizedPromise(client: Client, query: string, params: string[] = []) {
//     return new Promise(function (resolve, reject) {
//         client.query(query, params, function (err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

export async function getPokemonsFromAtlas(client: Client): Promise<void> {
    const query: string = 'SELECT * FROM pokemons';
    const pokemonsArray: Pokemon[] = [];
    const results = await client.query(query);
    console.log(results.rows);
    
    for (let i = 1; i < 8001; i++) {
    //     pokemonsArray.push(new Pokemon(
    //         // new BasicPokemonInfo(results.row[]
    //     ));
    }
    // return await collection.find({}).toArray() as unknown as Pokemon[];
}
