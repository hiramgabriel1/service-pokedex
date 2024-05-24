import { Router } from "express";
import { Pokemon } from "../controllers/pokemon.controller";
import { Request, Response } from "express";

const pokemonController = new Pokemon();
const path = "/api/v1";
const routerPokemon = Router();

routerPokemon.get(`${path}/entrenadores`, (req: Request, res: Response) =>
  pokemonController.getEntrenadores(req, res)
);

routerPokemon.get(`${path}/page`, (req: Request, res: Response) =>
  pokemonController.getPokedex(req, res)
);

routerPokemon.post(`${path}/add-entrenador`, (req: Request, res: Response) =>
  pokemonController.addEntrenador(req, res)
);

routerPokemon.put(
  `${path}/update-entrenador/:id`,
  (req: Request, res: Response) => pokemonController.updateEntrenador(req, res)
);

routerPokemon.delete(
  `${path}/delete-entrenador/:id`,
  (req: Request, res: Response) => pokemonController.deleteEntrenador(req, res)
);

routerPokemon.get(`${path}/create-pdf`, (req: Request, res: Response) =>
  pokemonController.createPDF(req, res)
);

export default routerPokemon;
