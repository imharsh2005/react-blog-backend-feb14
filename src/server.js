//const express = require('express');
import express from 'express';
import {MongoClient}  from 'mongodb';
import path from 'path';

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname,'../build')));

const articlesInfo ={
    'learn-react':{upvotes:0, comments:[]},
    'learn-node':{upvotes:0, comments:[]},
    'my-thoughts-on-resume':{upvotes:0, comments:[]},
};

const startServer = async () =>{
    
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('react-blog-feb2021');
    app.get('/api/articles/:name', async (req,res)=>{
        const {name} = req.params;
        const info  = await db.collection('articles').findOne({name})
       
        if (info){
            res.send(info);
        }else{
            res.sendStatus(404);
        }    
    });
    
    app.post('/api/articles/:name/upvotes', async (req,res)=>{
        //const client = await MongoClient.connect('mongodb://localhost:27017');
        //const db = client.db('react-blog-feb2021');
    
        const {name} = req.params;
        await db.collection('articles').updateOne(
            {name},
            {$inc:{upvotes:1}},
        );
        const updateArticleInfo = await db.collection('articles').findOne({name});
    
        res.send(updateArticleInfo);
    
    });

    app.post('/api/articles/:name/comments', async (req,res)=>{
        //const client = await MongoClient.connect('mongodb://localhost:27017');
        //const db = client.db('react-blog-feb2021');
    
        const {text, postedBy} = req.body;
        const {name } = req.params;

        await db.collection('articles').updateOne(
            {name},
            {$push:{comments:{text, postedBy}}},
        );
        const updateArticleInfo = await db.collection('articles').findOne({name});
    
        res.send(updateArticleInfo);
    
    });
    
/*     app.post('/api/articles/:name/comments', (req, res)=>{
        const {text, postedby} = req.body;
        const {name} = req.params;
    
        articlesInfo[name].comments.push({text,postedby});
        res.send(articlesInfo[name]);
    
    }); */
    
    //this is a special rout for deployment
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'../build/index.html'));
    });

    app.listen(8000, ()=>console.log('server is listening on port 8000'));
    

};

startServer();

// to automatically restart server after change is to install  "nodemon" package 
//and start server with nodemon -  npx nodemon --exec "npx babel-node ./src/server.js"

/*
app.get('/hello', (req,res)=> {
    const obj = {msg: { text:  "hello!!" }};
    res.send(obj?.msg?.text);
});


app.get('/hello/:name',(req,res)=>{
    const {name } = req.params;
    res.send(`hello ${name}`);
});

app.post('/hello', (req,res)=>{
    const {name} = req.body;
    res.send(`hello ${name}!`);
});
*/



