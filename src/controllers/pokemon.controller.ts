import { Request, Response } from "express";
import {
    PokemonDetails,
    PokemonInterface,
} from "../interfaces/pokemon.interface";
import { getPokemonInfo } from "../validators/pokemon.info";

export class Pokemon {
    constructor() { }

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
            pokemons.map(
                async (pokemon: any) => await getPokemonInfo(pokemon, type)
            )
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

    async getAllPokemons(req: Request, res: Response) {
        res.send("hello");
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
