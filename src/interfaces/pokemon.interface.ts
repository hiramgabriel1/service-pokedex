export interface PokemonInterface {
    name: string;
    url: string;
}

export interface PokemonData {
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

export interface PokemonInfo {
    id: number;
    name: string; 
    type: string;
    abilities: string;
    species: string;
    height: number;
    weight: number;
    imageUrl: string;
  }

export interface Info {
    name: string;
    url: string;
}
export interface PokemonTypes {
    slot: number,
    type: Info
}
export interface PokemonAbilities {
    ability: Info,
    is_hidden: boolean,
    slot: number
}