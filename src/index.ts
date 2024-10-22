import express, { Application } from "express";
import * as dotenv from "dotenv";
import SpeciesGrabber from "./classes/species-grabber";
import fs from "fs";
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();

const Grabber = new SpeciesGrabber();
const app = express();

app.get("/creatures/:name", (req: express.Request, res: express.Response) => {
    const { name } = req.params;
    Grabber.fetchSpecies(name)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ error: error.message }));
});

export default app;