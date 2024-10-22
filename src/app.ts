import express, { Application } from "express";
import * as dotenv from "dotenv";
import SpeciesGrabber from "./classes/species-grabber";
import fs from "fs";

export const initialize = async () => {
  dotenv.config();

  const Grabber = new SpeciesGrabber();
  // const data = await Grabber.fetchSpecies();

  // fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const app = express();

  app.get("/creatures/:name", (req, res) => {
      const { name } = req.params;
      Grabber.fetchSpecies(name).then((data) => {
          res.json(data);
      }).catch((error) => {
          res.status(500).json({ error: error.message });
      });
  });

  app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
  });
};