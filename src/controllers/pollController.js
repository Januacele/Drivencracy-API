import db from "../databse/mongodb.js";
import { ObjectId } from "mongodb";

import dayjs from "dayjs";



export async function creatPoll(req, res){
    const { title, expireAt } = req.body;
    let now = dayjs();
    const date30 = now.add(1, 'M').format('YYYY-MM-DD HH:mm');

    let expire = date30;
    
    if (expireAt.length) {
        expire = expireAt;
    }

    try {
        const insertPoll = await db.collection('polls').insertOne({
            title,
            expireAt: expire
        });

        res.status(201).send(insertPoll);

    } catch (error) {
        return res.sendStatus(500)
    }
}


export async function getPoll(req, res){

    try {
        const findPolls = await db.collection('polls').find().toArray();
        res.status(201).send(findPolls);

    } catch (error) {
        res.sendStatus(500);
    }
}


export async function getPollChoice(req, res){
    const id = req.params.id;

    try {
        const polls = await db.collection("polls").findOne({
            _id: new ObjectId(id)
        });
        if (!polls) {
            return res.sendStatus(404);
        }

        const chooseOptions = await db.collection("choices").find({
            pollId: id
        }).toArray();
        res.send(chooseOptions);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Erro ao obter as opçoes de voto");
    }
}


export async function getPollResult(req, res){

    const pollId = req.params.id;
    
        try {
    
            const validPool = await db.collection('polls').findOne({
                _id: ObjectId(pollId)
            });
        
            if(!validPool){
                return res.status(404).send('Enquete não encontrada');
            }
    
          const choices = await db
            .collection("choices")
            .find({ pollId: pollId })
            .toArray();
      
          let mostVoted = 0;
          let mostVotedTitle = "";
      
          for (let i = 0; i < choices.length; i++) {
            let votes = choices[i].votes;
      
            if (votes > mostVoted) {
              mostVoted = votes;
              mostVotedTitle = choices[i].title;
            }
          }
      
          const result = {
            title: mostVotedTitle,
            votes: mostVoted,
          };
      
          const poll = await db
            .collection("polls")
            .findOne({ _id: ObjectId(pollId) });
      
          const results = { ...poll, result };
      
          return res.status(201).send(results);
        } catch (error) {
          return res.status(500).send("Falha ao tentar pegar o resultado", error);
        }
      
    }