import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import SpeciesGrabber from "../classes/species-grabber";

dotenv.config();

const Grabber = new SpeciesGrabber();
const app = express();

app.get("/creatures/:name", async (req: Request, res: Response) => {
    const name = req.params.name;
    Grabber.fetchSpecies(name)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ error: error.message }));
});

export default app;