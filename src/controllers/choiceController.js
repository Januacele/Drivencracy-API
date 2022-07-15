import db from "../databse/mongodb.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";



export async function creatChoice(req, res){
    let now = dayjs();
    const date = now.format('YYYY-MM-DD HH:mm');

    const { title, pollId } = req.body;

    try {
        const pollIdExist = await db.collection('polls').findOne({
            _id: ObjectId(pollId)
        });

        if (!pollIdExist) {
            return res.sendStatus(404);
        }

        const { expireAt } = pollIdExist;
        if (expireAt < date) {
            return res.sendStatus(403);
        }

        if (title.length === 0) {
            return res.sendStatus(422);
        }

        const titleExist = await db.collection('choices').findOne({ title });
        if (titleExist) {
            return res.sendStatus(409)
        }

        await db.collection('choices').insertOne({ title, pollId, votes: 0 });
        res.sendStatus(201);

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}


export async function addVote (req, res) {
    const id = req.params.id;
    let now = dayjs();

    try {
        let voteExists = await db.collection("choices").findOne({ _id: ObjectId(id) });
        if (!voteExists) {
            return res.sendStatus(404);
        }

        const pollExists = await db
            .collection("polls")
            .findOne({ _id: new ObjectId(voteExists.pollId) });
        console.log(pollExists.expireAt);

        const { expireAt } = pollExists.expireAt;

        const pollExpires = now.add();

        if (expireAt < pollExpires) {
            return res.sendStatus(403);
        }

        await db
        .collection("choices")
        .findOneAndUpdate({ _id: ObjectId(id) }, { $inc: { votes: 1 } });

        await db.collection("votes").insertOne({
            title: voteExists.title,
            pollId: voteExists.pollId,
            choiceId: voteExists._id,
            createdAt: now.format("YYYY-MM-DD HH:mm:ss")
        });
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Erro ao votar");
    }
}