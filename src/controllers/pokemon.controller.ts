import { Request, Response } from "express";
import {
    PokemonDetails,
    PokemonInterface,
    PokemonData,
} from "../interfaces/pokemon.interface";
import { getPokemonInfo } from "../utils/pokemon.info";
import { PokemonClient } from "pokenode-ts";
import { PokemonModel } from "../models/pokemon.model";
import createPdf from "../data/creator.pdf";

export class Pokemon {
    private pokemonClient: PokemonClient;

    constructor() {
        this.pokemonClient = new PokemonClient();
    }

    private normalizeSearchTerm(search: string): string {
        return search.replace(/\s/g, "-").toLowerCase();
    }

    private filterPokemons(
        allPokemons: PokemonInterface[],
        normalizedSearch: string
    ): PokemonInterface[] {
        return allPokemons.filter((pokemon: PokemonInterface) =>
            pokemon.name.toLowerCase().includes(normalizedSearch)
        );
    }

    private paginateResults(
        filteredPokemons: PokemonInterface[],
        startIndex: number,
        endIndex: number
    ): PokemonInterface[] {
        return filteredPokemons.slice(startIndex, endIndex);
    }

    private async handlePokemonDetails(
        pokemons: PokemonInterface[],
        type: string
    ): Promise<PokemonDetails[]> {
        return Promise.all(
            pokemons.map(async (pokemon: PokemonInterface) => {
                const data = await getPokemonInfo(pokemon.name, type);
                return {
                    name: data?.name || "",
                    imageUrl: data?.imageUrl || "",
                    type: data?.type || "",
                    abilities: data?.abilities || "",
                    id: data?.id || 0,
                };
            })
        );
    }

    private async doesPokemonExist(name: string): Promise<boolean> {
        const existingPokemon = await PokemonModel.findOne({ name });
        return !!existingPokemon;
    }

    async getPokedex(req: Request, res: Response): Promise<void> {
        try {
            const { limit, page, search, pdf } = req.query;
            const ValueLimit = limit ? parseInt(limit as string, 10) : 18;
            const ValuePage = page ? parseInt(page as string, 10) : 1;
            let pokemons: any;

            if (search) {
                const normalizedSearch = this.normalizeSearchTerm(search as string);
                const allPokemons = await this.pokemonClient.listPokemons(1, 2000);

                if (!allPokemons || !allPokemons.results) res.status(204).send();

                const filteredPokemons = this.filterPokemons(
                    allPokemons.results,
                    normalizedSearch
                );

                const startIndex = (ValuePage - 1) * ValueLimit;
                const endIndex = startIndex + ValueLimit;
                const paginatedPokemons = this.paginateResults(
                    filteredPokemons,
                    startIndex,
                    endIndex
                );

                if (paginatedPokemons.length === 0 && !pdf) res.status(204).send();

                const pokemonDetails = await this.handlePokemonDetails(
                    paginatedPokemons,
                    "pokedex"
                );

                res.json({
                    results: pokemonDetails,
                    count: filteredPokemons.length,
                });
            } else if (page) {
                pokemons = await this.pokemonClient.listPokemons(ValuePage, ValueLimit);

                if (!pokemons || !pokemons.results || (pokemons.results.length === 0 && !pdf)) res.status(204).send();

                const pokemonDetails = await this.handlePokemonDetails(
                    pokemons.results,
                    "pokedex"
                );

                res.json({ results: pokemonDetails, count: pokemons.count });
            } else {
                res.status(400).json({ error: "Page or search query parameter is required" });
            }
        } catch (error) {
            console.error("Error fetching Pokémon data:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getMyPokemons(req: Request, res: Response): Promise<void> {
        try {
            const pokemons = await PokemonModel.find();

            if (!pokemons || pokemons.length === 0) res.status(204).send();
            res.json(pokemons);
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addPokemon(req: Request, res: Response): Promise<void> {
        try {
            let { name, type } = req.body;
            name = this.normalizeSearchTerm(name as string);

            const pokemonExists = await this.doesPokemonExist(name);

            if (pokemonExists) res.status(409).json({ error: "Pokemon with the same name already exists" });

            const data = await getPokemonInfo(name, "pokemon");
            const imageUrl = data?.imageUrl || "";
            type = data?.type || type;

            const newPokemon = new PokemonModel({ name, type, imageUrl });

            await newPokemon.save();

            res.status(201).json(newPokemon);
        } catch (error) {
            console.error("Error handling POST request:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async updatePokemon(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            let { name, type } = req.body;
            name = this.normalizeSearchTerm(name as string);

            const pokemonExists = await this.doesPokemonExist(name);

            if (pokemonExists) res.status(409).json({ error: "Pokemon with the same name already exists" });

            const data = await getPokemonInfo(name, "pokemon");
            const imageUrl = data?.imageUrl || "";
            type = data?.type || type;

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

    async deletePokemon(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            console.log(id);

            await PokemonModel.findByIdAndDelete(id);

            res.json({ message: "Pokemon deleted successfully" });
        } catch (error) {
            console.error("Error deleting pokemon:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async createPDF(req: Request, res: Response) {
        try {
            let { pokemon } = req.query;
            pokemon = this.normalizeSearchTerm(pokemon as string);
            const pokemonInfo = await getPokemonInfo(pokemon, "pokedexToPdf");

            if (pokemonInfo !== null) {
                const pdfBytes = await createPdf(pokemonInfo);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", `attachment; filename=${pokemon}.pdf`);
                res.setHeader("Content-Length", pdfBytes.length);
                res.write(pdfBytes, "binary");
                res.end(null, "binary");

            } else {
                res.status(404).send("Pokemon not found");
            }

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}