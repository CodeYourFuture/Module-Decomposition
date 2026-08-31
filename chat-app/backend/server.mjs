import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// array to hold the data: username ,message

const data = [];

//Get Method : send all data on page load/refresh
app.get('/api/message',(req,res) => {
    res.json(data);
});

//Post : save name and message

app.post('/api/message',(req,res) => {
    const {name,message} = req.body;

    if (name && message)
        {
            data.push({name,message});
            res.status(201).json({success:true,message : 'Saved Successfully'});
        } else{
            res.status(400).json({error: 'Both name and message are required'});
        }

});

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${PORT}`);
});

