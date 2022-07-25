import { BasicPokemonInfo, Pokemon } from "./pokemon";
import * as fs from "fs";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as path from "path";
import { Express } from "express";
import PokeDB from "./dataBase";
import express = require("express");

const app: Express = express();
const root = path.join(process.cwd(), "dist");
const portHttp = process.env.PORT || 4000;
let db: PokeDB = new PokeDB();

app.use(cors());
app.use(bodyParser.json());

app.get("/json", async (req, res) => {
    console.log("Sending client pokemonsJson");
    try {
        const limit = req.query["limit"];
        const offset = req.query["offset"];
        let isDone = false;
        const limitedJSON = await db.getPokemonsFromDb(String(limit) , String(offset));
        if(limitedJSON.length < Number(limit))
            isDone = true;
        res.json({ data: limitedJSON, isDone: isDone });
    } catch (e) {
        console.log(e);
    }
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

app.get("/getPokemon/:id", async (req, res) => {
    console.log("Sending client pokemon " + req.params["id"] + " json");
    console.log(db);
    const pokemon = (await db.getPokemonsFromDb(req.params["id"]))[0];
    if (pokemon !== undefined) {
        res.json(pokemon);
    } else {
        console.log("----pokemon not found----");
        res.json(new Pokemon(new BasicPokemonInfo("-1", "not found", "-1")));
    }
});

app.listen(portHttp, async () => {
    // await db.connect();
    console.log("Hosted: http://localhost:" + portHttp);
});

