// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { MongoClient, ObjectId } from "mongodb";
// import dayjs from "dayjs";
// import joi from "joi";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());


// const mongoClient = new MongoClient(process.env.MONGO_URI);
// let db;

// function mongoConection() {
//     mongoClient.connect().then(() => {
//         db = mongoClient.db(process.env.MONGO_DATABASE);
//     });
// }
// mongoConection();


// app.post('/poll', async (req, res) => {
//     const { title, expireAt } = req.body;
//     let now = dayjs();
//     const date30 = now.add(1, 'M').format('YYYY-MM-DD HH:mm');


//     const pollSchema = joi.object({
//         title: joi.string().required(),
//         expireAt: joi.string().allow("")
//     });

//     const validate = pollSchema.validate(req.body);

//     if (validate.error) {
//         return res.status(422).send('Título é um dado obrigatório');
//     }

//     let expire = date30;
//     if (expireAt.length) {
//         expire = expireAt;
//     }

//     try {
//         const insertPoll = await db.collection('polls').insertOne({
//             title,
//             expireAt: expire
//         });

//         res.status(201).send(insertPoll);

//     } catch (error) {
//         return res.sendStatus(500)
//     }
// });

// app.get('/poll', async (req, res) => {

//     try {
//         const findPolls = await db.collection('polls').find().toArray();
//         res.status(201).send(findPolls);

//     } catch (error) {
//         res.sendStatus(500);
//     }
// });

// app.post('/choice', async (req, res) => {
//     let now = dayjs();
//     const date = now.format('YYYY-MM-DD HH:mm');

//     const { title, pollId } = req.body;

//     const choiceSchema = joi.object({
//         title: joi.string().required(),
//         pollId: joi.string().required()
//     });

//     const validateChoice = choiceSchema.validate(req.body);

//     if (validateChoice.error) {
//         return res.sendStatus(422);
//     }

//     try {
//         const pollIdExist = await db.collection('polls').findOne({
//             _id: ObjectId(pollId)
//         });

//         if (!pollIdExist) {
//             return res.sendStatus(404);
//         }

//         const { expireAt } = pollIdExist;
//         if (expireAt < date) {
//             return res.sendStatus(403);
//         }

//         if (title.length === 0) {
//             return res.sendStatus(422);
//         }

//         const titleExist = await db.collection('choices').findOne({ title });
//         if (titleExist) {
//             return res.sendStatus(409)
//         }

//         await db.collection('choices').insertOne({ title, pollId });
//         res.sendStatus(201);

//     } catch (error) {
//         console.log(error)
//         return res.sendStatus(500)
//     }
// });

// app.get('/poll/:id/choice', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const polls = await db.collection("polls").findOne({
//             _id: new ObjectId(id)
//         });
//         if (!polls) {
//             return res.sendStatus(404);
//         }

//         const chooseOptions = await db.collection("choices").find({
//             pollId: id
//         }).toArray();
//         res.send(chooseOptions);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send("Erro ao obter as opçoes de voto");
//     }
// });

// app.post("/choice/:id/vote", async (req, res) => {
//     const id = req.params.id;
//     let now = dayjs();

//     try {
//         let voteExists = await db.collection("choices").findOne({ _id: ObjectId(id) });
//         if (!voteExists) {
//             return res.sendStatus(404);
//         }

//         const pollExists = await db
//             .collection("polls")
//             .findOne({ _id: new ObjectId(voteExists.pollId) });
//         console.log(pollExists.expireAt);

//         const { expireAt } = pollExists.expireAt;

//         const pollExpires = now.add();

//         if (expireAt < pollExpires) {
//             return res.sendStatus(403);
//         }

//         await db.collection("votes").insertOne({
//             title: voteExists.title,
//             pollId: voteExists.pollId,
//             choiceId: voteExists._id,
//             createdAt: now.format("YYYY-MM-DD HH:mm:ss")
//         });
//         res.sendStatus(201);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send("Erro ao votar");
//     }
// });

// app.get('/poll/:id/result', async (req, res) => {
//     const id = req.params.id;
       
//     try {
//         const existPoll = await db.collection("polls").findOne({ _id: ObjectId(id) });

//         if(!existPoll){
//             res.sendStatus(404);
//         }

//         const votes = await db.collection("votes").find({pollId: id}).toArray();
//         const specificVote = votes[0]
//         const choices = await db.collection("choices").findOne({ pollId: String(specificVote.pollId) });
//         const polls = await db
//           .collection("polls")
//           .findOne({ _id: new ObjectId(choices.pollId) });
//           console.log(votes[0])
//       const results = await db.collection("results").insertOne({
//         title: polls.title,
//         expireAt: polls.expireAt,
//         result: {
//           title: choices.title,
//           votes: votes.length
//         },
//       });
//       const result = await db.collection("results").find({title: polls.title}).toArray()
//       result.reverse()
//       console.log(result)
//       res.send(result[0]);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send("Erro ao pegar o resultado");
//     }
// });

// const PORT = process.env.PORT || 5001

// app.listen(PORT, () => {
//     console.log(`Server is runing on port: ${process.env.PORT}`);
// });