import { Request, Response } from "express";
import {
    PokemonDetails,
    PokemonInterface,
} from "../interfaces/pokemon.interface";
import { getPokemonInfo } from "../validators/pokemon.info";
import { PokemonClient } from "pokenode-ts";

export class Pokemon {
    private pokemonClient: PokemonClient;

    constructor() {
        this.pokemonClient = new PokemonClient();
    }

    private normalizeSearchTerm(search: string): string {
        return search.replace(/\s/g, "-");
    }

    private filterPokemons(allPokemons: PokemonInterface[], normalizedSearch: string): PokemonInterface[] {
        return allPokemons.filter((pokemon: PokemonInterface) =>
            pokemon.name.toLowerCase().includes(normalizedSearch.toLowerCase())
        );
    }

    private paginateResults = (
        filteredPokemons: Pokemon[],
        startIndex: number,
        endIndex: number
    ): Pokemon[] => filteredPokemons.slice(startIndex, endIndex);

    private handlePokemonDetails = async (pokemons: Pokemon[], type: string): Promise<PokemonDetails[]> =>
        Promise.all(pokemons.map(async (pokemon: any) => await getPokemonInfo(pokemon, type)));

    private getPokemonInfoDetails = async (pokemon: PokemonDetails, type: string): Promise<PokemonDetails> => {
        const data = await getPokemonInfo(pokemon.name, type);
        return {
            name: data?.name || "",
            imageUrl: data?.imageUrl || "",
            type: data?.type || "",
            abilities: data?.abilities || "",
            id: data?.id || 0,
        };
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

                    if (paginatedPokemons.length !== ValueLimit && !pdf) return res.status(204).send();

                    const pokemonDetails = await this.handlePokemonDetails(paginatedPokemons, "pokedex");
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
                if (pokemons.results.length !== ValueLimit && !pdf) return res.status(204).send();
            }

            const pokemonDetails = await this.handlePokemonDetails(pokemons.results, "pokedex");
            return res.json({ results: pokemonDetails, count: pokemons.count });
        } catch (error) {
            console.error("Error fetching Pokémon data:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async addPokemon(req: Request, res: Response) {
        res.send("hello");
    }

    async updatePokemon(req: Request, res: Response) {
        res.send("hello");
    }

    async deletePokemon(req: Request, res: Response) {
        res.send("hello");
    }

    async page(req: Request, res: Response) { }
}