import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import bodyParser from "body-parser";

dotenv.config();

const router = express.Router();

const app = express();

// Middleware to parse JSON with an increased limit (e.g., 20MB)
app.use(bodyParser.json({ limit: "20mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").get((req, res) => {
  res.send("Hello AI Image Generation App!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
});

export default router;
