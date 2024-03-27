const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser")
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const {postSchema} = require("./Schema.js");
const cors = require("cors");

const jwtKey = process.env.JWT;
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    parameterLimit: 100000,
    extended: false 
}));

app.use(bodyParser.json({
    limit: '10mb'
}));

const DB = "mongodb+srv://snips:snips@cluster0.hscsw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(DB).then(() => {
	console.log("CONNECTED TO DB");
}).catch(err => console.log(err));

const Question = new mongoose.model("subjectEntries", postSchema);

app.post("/postQue", async(req, res) => {
    // console.log(req.body)
    let sub = req.body.sub;
    let note = req.body.note;
    let QType = req.body.qtype;
    let group = req.body.QGrp;
    let img = req.body.img;
    let voiceNote = req.body.voiceNote;
    let date = req.body.date;
    let time = req.body.time;
    let uId = new Date().getTime();
    console.log(req.body.sub)
    try {
        let newS = new Question({uId,subject:sub, note, QType, group, img, voiceNote, date, time})
        await newS.save().then(() =>{
            res.json({
                status: 200,
                data:"Kaam ho gaya"
            });
        });
    } catch(err) {
        console.log("There's nothing we can do");
    }
});

app.get("/search", async(req, res) => {
    let sub = req.query.sub;
    let text = req.query.textInput;
    let Qtype = req.query.type;
    let grp = req.query.grp;
    console.log(req.query)
    try {
        let data1 = await Question.find({subject:{$regex : sub}, QType:{$regex : Qtype}, group:{$regex : grp}});
        let newArr = [];
        console.log(data1)
        // /users.findOne({"username" : {$regex : "son"}});
        data1.forEach((e) => {
            if(e['note'].toLowerCase().includes(text)) newArr.push(e)
        });
        res.json({
            msg:'yes',
            data:newArr
        });
    } catch(err) {
        res.json({
            msg:'bup'
        })
    }
});

app.get("/deleteQue", async(req, res) => {
    let uId = req.query.uId;
    try {
        await Question.deleteOne({uId : uId});
        res.json({
            msg:'yes'
        });
    }
     catch(err) {
        res.json({
            msg:'err'
        })
     }
});

const test = async() => {
    let a = await Question.find({});
    // a.forEach(async(e) => {
    //     console.log(await Question.deleteOne({uId:e['uId']}))
    // })
    // console.log(a)
};

test()

app.listen(port, () => console.log("Things Just Got Out Of Hands!"));