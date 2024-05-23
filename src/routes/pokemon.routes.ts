// pokemon.routes.ts

import { Router } from "express";
import { Pokemon } from "../controllers/pokemon.controller";
import { Request, Response } from "express";

const pokemonController = new Pokemon();
const path = "/api/v1"; 
const routerPokemon = Router();

routerPokemon.get("/get-pokemon", (req: Request, res: Response) =>
  pokemonController.getPokedex(req, res)
);
routerPokemon.get(`${path}/page`, (req: Request, res: Response) =>
  pokemonController.getPokedex(req, res)
);

routerPokemon.post(`${path}/add-pokemon`, (req: Request, res: Response) =>
  pokemonController.addPokemon(req, res)
);
routerPokemon.put(`${path}/update-pokemon`, (req: Request, res: Response) =>
  pokemonController.updatePokemon(req, res)
);
routerPokemon.delete(`${path}/delete-pokemon`, (req: Request, res: Response) =>
  pokemonController.deletePokemon(req, res)
);

export default routerPokemon;
