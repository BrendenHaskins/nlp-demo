import dotenv from 'dotenv';
import express from 'express';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text"

dotenv.config();
const {PORT, KEY, REGION, HOISTNAME, ENDPOINT} = process.env;

const client = new TextAnalysisClient(ENDPOINT, new AzureKeyCredential(KEY));

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
async function sentiment(input) {
    let documents = [{
        text: input,
        id: "0",
        language: "en"
    }];

    const results = await client.analyze("SentimentAnalysis", documents)

    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.error) {
            return result.sentences[0].confidenceScores.negative;
        } else {
            console.error(`\tError: ${result.error}`);
        }
    }
}


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/', async (req,res) => {
    const input = req.body.text;
    const score = await sentiment(input);
    console.log(`Incoming Request: "${input}" \tResponse: Negative Score ${score}`)
    res.send(score);
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
})

