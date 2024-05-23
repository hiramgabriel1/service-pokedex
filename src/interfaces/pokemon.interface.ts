export interface Pokemon {
    name: string;
    url: string;
}

export default interface PokemonData {
    id: number;
    name: string;
    type: string;
    abilities: string;
    species: string;
    height: number;
    weight: number;
    imageUrl: string;
}

export interface PokemonDetails {
    name: string;
    imageUrl: string;
    type: string;
    abilities: string;
    id: number;
}

