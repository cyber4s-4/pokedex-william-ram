import { MongoClient, Db, Collection/*, WithId*/ } from 'mongodb';
import { BasicPokemonInfo, Stat, Pokemon } from './pokemon';


export function create() {
    // TODO - Replace with your own mongo url
    const uri = "mongodb+srv://ram1660:5zQncu8kz307VbvU@cluster0.llfosrp.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    return client;
}

export async function connect(client: MongoClient) {
    await client.connect();
    const db: Db = client.db('pokemonAPI');
    const collection: Collection = db.collection('pokemons');
    return collection;
}

export async function createMergedPokemons(pokemonsToMergeArray: Pokemon[], collection: Collection):Promise<Pokemon[]> {
    const length  = pokemonsToMergeArray.length;  
    let mergedPokemonsArray = [];
    let count = await collection.count({});
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (i != j) {
                const mergedPokemon = (mergePokemons(pokemonsToMergeArray[i], pokemonsToMergeArray[j],count));
                mergedPokemonsArray.push(mergedPokemon);
                count++;
            }
        }
    }
    return mergedPokemonsArray;
}

function mergePokemons(pokemon1: Pokemon, pokemon2: Pokemon, count : number):Pokemon {
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
