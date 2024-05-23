import { PokemonClient } from "pokenode-ts";
import {
    Info,
    PokemonAbilities,
    PokemonInfo,
    PokemonTypes,
} from "../interfaces/pokemon.interface";

export async function getPokemonInfo(
    name: string,
    type: string
): Promise<PokemonInfo | any> {
    let pokemon = name.toLowerCase().replace(/\s+/g, "-");
    let pokemonClient = new PokemonClient()

    try {
        const data = await pokemonClient.getPokemonByName(pokemon);
        pokemon = pokemon.replace(/-/g, " ");

        const imageUrl = data.sprites.front_default || "";
        const arrayTypes = data.types.map((obj: PokemonTypes) => obj.type.name);
        const typeString = arrayTypes.join(" - ");

        if (type.includes("pokedex")) {
            let abilities: any = data.abilities.map(
                (obj: PokemonAbilities) => obj.ability.name
            );

            abilities = abilities.join(" - ");

            if (type === "pokedexToPdf") {
                return {
                    id: data.id,
                    name: pokemon,
                    type: typeString,
                    abilities,
                    species: data.species.name,
                    height: data.height,
                    weight: data.weight,
                    imageUrl,
                };
            }

            return {
                id: data.id,
                name: pokemon,
                type: typeString,
                abilities,
                species: "",
                height: 0,
                weight: 0,
                imageUrl,
            };
        }

        return {
            id: 0,
            name: pokemon,
            type: typeString,
            abilities: "",
            species: "",
            height: 0,
            weight: 0,
            imageUrl,
        };
    } catch (error) {
        console.log(error);
        throw new Error('pokemon no encontrado')
    }
}
