const pokemonFile = require('./pokemon');
const Pokemon = pokemonFile.default;
const BasicPokemonInfo = pokemonFile.BasicPokemonInfo;
const Stat = pokemonFile.Stat;
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let pokemonsJson = [];

const portHttp = 4000;

// Fetches a basic info from pokeapi and adds to the pokemonsData.json.
async function fetchBasicPokemonData() {
    const spriteLink = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png';
    fs.writeFileSync('./pokemonsData.json', '[]');
    pokemonsJson = JSON.parse(fs.readFileSync('./pokemonsData.json').toString());
    if (pokemonsJson.length === 0) {
        const pokemonsList = (await(await fetch('https://pokeapi.co/api/v2/pokemon?limit=899&offset=0')).json());
        for (let i = 0; i < 898; i++) {
            const pokemonImgLink = spriteLink.replace('{id}', (i + 1).toString());
            const pokemon = pokemonsList['results'][i];
            let pokemonName = pokemon['name'];
            pokemonName = pokemonName.replace(pokemonName[0], pokemonName[0].toUpperCase());
            pokemonsJson.push(new Pokemon(new BasicPokemonInfo((i + 1).toString(), pokemonName, pokemonImgLink)));
        }
        fs.writeFileSync('./pokemonsData.json', JSON.stringify(pokemonsJson));
    }
}

function getPokemonById(id) {
    return pokemonsJson.find((pokemon) => pokemon.basicInfo.id == id);
}

// Whenever a user enters to a pokemon info page it first searches if it exists locally and if not fetches from the server
// and updates locally.
async function fetchExtendedInfoByID(id) {
    const pokemonJSON = (await(await fetch('https://pokeapi.co/api/v2/pokemon/' + id)).json());
    const pokemon = getPokemonById(id);
    pokemon.abilities = [];
    pokemon.stats = [];
    pokemon.types = [];
    for (const abilityJSON of pokemonJSON['abilities']) {
        pokemon.abilities.push(abilityJSON['ability']['name']);
    }
    for (const statJSON of pokemonJSON['stats']) {
        pokemon.stats.push(new Stat(statJSON['stat']['name'], statJSON['base_stat']))
    }
    for (const typeJSON of pokemonJSON['types']) {
        const typeWithCapital = typeJSON['type']['name'].replace(typeJSON['type']['name'][0], typeJSON['type']['name'][0].toUpperCase())
        pokemon.types.push(typeWithCapital);
    }
    pokemon.height = (Number(pokemonJSON['height']) / 10).toString() + 'm';
    pokemon.weight = (Number(pokemonJSON['weight']) / 10).toString() + 'kg';
    if (pokemonJSON['sprites']['other']['official-artwork']['front_default'] !== null) {
        pokemon.largeImg = pokemonJSON['sprites']['other']['official-artwork']['front_default'];
    }
    else pokemon.largeImg = pokemon.basicInfo.img;

    fs.writeFileSync('./pokemonsData.json', JSON.stringify(pokemonsJson));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const root = path.join(process.cwd(), 'dist');

app.get("/json", (req, res) => {
    res.json(pokemonsJson);
})

app.get("/update/:id", async (req, res) =>  {
    await fetchExtendedInfoByID(req.params['id']);
    res.json(pokemonsJson);
})

app.use(express.static(root), (req, res, next) => {
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(root, 'index.html'));
});

app.get('/pokemon/:id', (req, res) => {
    res.sendFile(path.join(root, 'pokemon.html'));
})

app.listen(portHttp, () => {
    fetchBasicPokemonData();
    console.log('Hosted: http://localhost:' + portHttp);
});