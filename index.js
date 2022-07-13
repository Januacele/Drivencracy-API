import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

function mongoConection() {
    mongoClient.connect().then(() => {
        db = mongoClient.db(process.env.MONGO_DATABASE); 
      });
}
mongoConection();


app.get("/", (req, res) => {
    // Manda como resposta o texto 'Hello World'
    res.send('Hello World');
});

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${process.env.PORT}`);
});