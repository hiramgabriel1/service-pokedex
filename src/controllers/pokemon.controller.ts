import { Request, Response } from "express";
import {
  PokemonDetails,
  PokemonInterface,
} from "../interfaces/pokemon.interface";
import { getPokemonInfo } from "../validators/pokemon.info";
import { PokemonClient } from "pokenode-ts";
import { PokemonModel } from "../models/pokemon.model";

export class Pokemon {
  private pokemonClient: PokemonClient;

  constructor() {
    this.pokemonClient = new PokemonClient();
  }

  private normalizeSearchTerm(search: string): string {
    return search.replace(/\s/g, "-");
  }

  private filterPokemons(
    allPokemons: PokemonInterface[],
    normalizedSearch: string
  ): PokemonInterface[] {
    return allPokemons.filter((pokemon: PokemonInterface) =>
      pokemon.name.toLowerCase().includes(normalizedSearch.toLowerCase())
    );
  }

  private paginateResults = (
    filteredPokemons: Pokemon[],
    startIndex: number,
    endIndex: number
  ): Pokemon[] => filteredPokemons.slice(startIndex, endIndex);

  private handlePokemonDetails = async (
    pokemons: Pokemon[],
    type: string
  ): Promise<PokemonDetails[]> =>
    Promise.all(
      pokemons.map(async (pokemon: any) => await getPokemonInfo(pokemon, type))
    );

  private getPokemonInfoDetails = async (
    pokemon: PokemonDetails,
    type: string
  ): Promise<PokemonDetails> => {
    const data = await getPokemonInfo(pokemon.name, type);
    return {
      name: data?.name || "",
      imageUrl: data?.imageUrl || "",
      type: data?.type || "",
      abilities: data?.abilities || "",
      id: data?.id || 0,
    };
  };

  private doesPokemonExist = async (name: string) => {
    const existingPokemon = await PokemonModel.findOne({ name });
    return !!existingPokemon;
  };

  async getPokedex(req: Request, res: Response) {
    try {
      let { limit, page, search, pdf }: any = req.query;
      let pokemons: any;

      const ValueLimit = limit ? parseInt(limit as string, 10) : 18;
      const ValuePage = page ? parseInt(page as string, 10) : 1;

      if (search) {
        try {
          const normalizedSearch = this.normalizeSearchTerm(search as string);
          const allPokemons = await this.pokemonClient.listPokemons(1, 2000);

          // Verificar si allPokemons es undefined
          if (!allPokemons || !allPokemons.results) {
            return res.status(204).send();
          }

          const filteredPokemons: any = this.filterPokemons(
            allPokemons.results,
            normalizedSearch
          );

          const startIndex = ValuePage;
          const endIndex = startIndex + ValueLimit;
          const paginatedPokemons = this.paginateResults(
            filteredPokemons,
            startIndex,
            endIndex
          );

          if (paginatedPokemons.length !== ValueLimit && !pdf)
            return res.status(204).send();

          const pokemonDetails = await this.handlePokemonDetails(
            paginatedPokemons,
            "pokedex"
          );
          return res.json({
            results: pokemonDetails,
            count: filteredPokemons.length,
          });
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      } else if (page) {
        pokemons = await this.pokemonClient.listPokemons(page, limit);
        if (
          !pokemons ||
          !pokemons.results ||
          (pokemons.results.length !== ValueLimit && !pdf)
        )
          return res.status(204).send();
      }

      const pokemonDetails = await this.handlePokemonDetails(
        pokemons.results,
        "pokedex"
      );
      
      return res.json({ results: pokemonDetails, count: pokemons.count });
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPokemones(req: Request, res: Response) {
    try {
      const pokemons = await PokemonModel.find();

      if (!pokemons || pokemons.length === 0) return res.status(204).send();

      res.json(pokemons);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addPokemon(req: Request, res: Response) {
    try {
      let { name, type } = req.body;
      name = (name as string).replace(/\s/g, "-");

      const pokemonExists = await this.doesPokemonExist(name);

      if (pokemonExists)
        return res
          .status(204)
          .json({ error: "Pokemon with the same name already exists" });

      const data = await getPokemonInfo(name, "pokemon");
      const imageUrl = data?.imageUrl ? data?.imageUrl : "";
      type = data?.type ? data?.type : type;

      const newPokemon = new PokemonModel({ name, type, imageUrl });

      await newPokemon.save();

      res.json(newPokemon);
    } catch (error) {
      console.error("Error handling POST request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updatePokemon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let { name, type } = req.body;
      name = (name as string).replace(/\s/g, "-");

      const pokemonExists = await this.doesPokemonExist(name);

      if (pokemonExists)
        return res
          .status(204)
          .json({ error: "Pokemon with the same name already exists" });

      const data = await getPokemonInfo(name, "pokemon");
      const imageUrl = data?.imageUrl ? data?.imageUrl : "";
      type = data?.type ? data?.type : type;

      const updatedPokemon = await PokemonModel.findByIdAndUpdate(
        id,
        { name, type, imageUrl },
        { new: true }
      );
      res.json(updatedPokemon);
    } catch (error) {
      console.error("Error updating pokemon:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deletePokemon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PokemonModel.findByIdAndDelete(id);
      res.json({ message: "Pokemon deleted successfully" });
    } catch (error) {
      console.error("Error deleting pokemon:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async page(req: Request, res: Response) {}
}
