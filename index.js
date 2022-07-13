import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import dayjs from "dayjs";
import joi from "joi";

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


app.post('/poll', async (req, res) => {
    const {title, expireAt} = req.body;
    let now = dayjs();
    const date30 = now.add(1, 'M').format('YYYY-MM-DD HH:mm');
    console.log(date30);

    const pollSchema = joi.object({
        title: joi.string().required(),
        expireAt: joi.string().allow("")
    });

    const validate = pollSchema.validate(req.body);

    if(validate.error){
        return res.status(422).send('Título é um dado obrigatório');
    }

    let expire = date30;
    if(expireAt.length){
        expire = expireAt;
    }

    try {
        const insertPoll = await db.collection('polls').insertOne({
            title,
            expireAt:expire
        });

        res.status(201).send(insertPoll);

    } catch (error) {
        return res.sendStatus(500)
    }
});


app.get('/poll', async (req, res) => {
    
    try {
        const findPolls = await db.collection('polls').find().toArray();
        res.status(201).send(findPolls);
      } catch (error) {
        res.sendStatus(500);
      }
});

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${process.env.PORT}`);
});