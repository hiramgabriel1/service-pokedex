import { PDFDocument } from "pdf-lib";
import { Request, Response } from "express";
import { PokemonInfo } from "../interfaces/pokemon.interface";
import axios from "axios";
import fs from "fs";

const inputPdfPath = "./public/pdf-input.pdf";

export async function createPdf(pokemon: PokemonInfo): Promise<Uint8Array> {
    const existingPdfBytes = fs.readFileSync(inputPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const imageUrl = pokemon.imageUrl;
    const imageResponse = await axios.get(imageUrl, {responseType: "arraybuffer"});
    const imageBytes = new Uint8Array(imageResponse.data);
    const image = await pdfDoc.embedPng(imageBytes);
    const imageSize = image.scale(1);
    const x = 275;
    const y = page.getHeight() - imageSize.height - 475;
    const width = 325;
    const height = 325;
    const borderWidth = 3;

    page.drawImage(image, {
        x: x + borderWidth,
        y: y + borderWidth,
        width: width,
        height: height,
    });

    page.drawText(`Id: ${pokemon.id}`, {
        x: 50,
        y: page.getHeight() - 150,
        size: 18,
    });
    page.drawText(`Name: ${pokemon.name}`, {
        x: 50,
        y: page.getHeight() - 200,
        size: 18,
    });
    page.drawText(`Type: ${pokemon.type}`, {
        x: 50,
        y: page.getHeight() - 250,
        size: 18,
    });
    page.drawText(`Abilities: ${pokemon.abilities}`, {
        x: 50,
        y: page.getHeight() - 300,
        size: 18,
    });
    page.drawText(`Species: ${pokemon.species}`, {
        x: 50,
        y: page.getHeight() - 350,
        size: 18,
    });
    page.drawText(`Height: ${pokemon.height}`, {
        x: 50,
        y: page.getHeight() - 400,
        size: 18,
    });
    page.drawText(`Weight: ${pokemon.weight}`, {
        x: 50,
        y: page.getHeight() - 450,
        size: 18,
    });

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}
