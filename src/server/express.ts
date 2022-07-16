import { BasicPokemonInfo, Pokemon } from "./pokemon";
import * as fs from "fs";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as path from "path";
import { Express } from "express";
import * as PokemonDb from "./mongo";
import express = require("express");
import { Collection, MongoClient } from "mongodb";
import { fetchExtendedInfoByID, fetchAllExtended } from "./fetch";
declare global {
    var pokemonsJson: Pokemon[];
}
globalThis.pokemonsJson = [];

let pokemonCollection: Collection;
const app: Express = express();
const root = path.join(process.cwd(), "dist");
const portHttp = 4000;

async function downloadJSON() {
    if (!fs.existsSync(path.join(__dirname, "/pokemonsData.json"))) {
        console.log("Reading from atlas");

        pokemonsJson = await PokemonDb.getPokemonsFromAtlas(pokemonCollection);
        fs.writeFileSync(
            path.join(__dirname, "/pokemonsData.json"),
            JSON.stringify(pokemonsJson)
        );
    } else {
        pokemonsJson = JSON.parse(
            fs.readFileSync(path.join(__dirname, "/pokemonsData.json")).toString()
        ) as Pokemon[];
    }
}

app.use(cors());
app.use(bodyParser.json());

app.get("/json", (req, res) => {
    console.log("Sending client pokemonsJson");
    try {
        const limit = Number(req.query["limit"]);
        const offset = Number(req.query["offset"]);
        const limitedJSON = [];
        let isDone = false;
        for (let i = offset; i < limit + offset; i++) {
            if (pokemonsJson[i]) {
                limitedJSON.push(pokemonsJson[i]);
            } else {
                isDone = true;
                break;
            }
        }
        res.json({ data: limitedJSON, isDone: isDone });
    } catch (e) {
        console.log(e);
    }
});

app.get("/update/:id", async (req, res) => {
    console.log("Updating info by id");
    await fetchExtendedInfoByID(req.params["id"]);
    res.json(pokemonsJson);
});

app.use(express.static(root), (req, res, next) => {
    next();
});

app.get("/", (req, res) => {
    console.log("Sending the main page to the client");
    res.sendFile(path.join(root, "./index.html"));
});

app.get("/pokemon/:id", (req, res) => {
    console.log("Sending the Pokemon page to the client");
    res.sendFile(path.join(root, "./pokemon.html"));
});

app.get("/getPokemon/:id", (req, res) => {
    console.log("Sending client pokemon " + req.params["id"] + " json");
    if (pokemonsJson[Number(req.params["id"])] !== undefined) {
        res.json(pokemonsJson[Number(req.params["id"]) - 1]);
    } else {
        console.log("----pokemon not found----");
        res.json(new Pokemon(new BasicPokemonInfo("-1", "not found", "-1")));
    }
});

app.listen(portHttp, async () => {
    let db: MongoClient = PokemonDb.create();
    pokemonCollection = await PokemonDb.connect(db);
    await downloadJSON();
    console.log("Hosted: http://localhost:" + portHttp);
});

//READ ME
/* ------------This code was used to create a new Pokemon collection in mongo(the code was in app.listen)-------------*/
// fetchAllExtended();
// await pokemonCollection.insertMany(pokemonsJson);
// let tempArray = [];
// for (let i = 0; i < 420; i++) {
//     tempArray.push(pokemonsJson[i]);
// }
// console.log(tempArray.length);
// await pokemonCollection.insertMany(await PokemonDb.createMergedPokemons(tempArray, pokemonCollection));

