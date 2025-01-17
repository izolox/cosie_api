import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import SpeciesGrabber from "./classes/species-grabber";

dotenv.config();

const Grabber = new SpeciesGrabber();
const app = express();

app.get("/creatures/:name", async (req: Request, res: Response) => {
    const name = req.params.name;
    Grabber.fetchSpecies(name)
        .then((data) => res.json(data))
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;