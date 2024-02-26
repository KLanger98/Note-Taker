const express = require('express');

const uuid = require('./public/helpers/uuid')
const fs = require('fs')

const PORT = 3001 || process.env.PORT;
const path = require('path');

const app = express();
const { get } = require('https');

//Middleware
app.use(express.static('public'));
app.use(express.json());


app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

//load notes.html at /notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

//Route path to GET notes.json 
app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', "utf8", (err, data) =>{
        if(err){
            console.error(err);
            res.status(500).json({error: 'Failed to read data'});
            return
        }

        try {
            const noteData = JSON.parse(data);
            console.log(noteData);
            res.status(200).json(noteData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
})

//Route path to POST new note
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a review`)

    const { title, text} = req.body;

    if(title && text){
        const newNote = {
            title, 
            text,
            id: uuid()
        };


        fs.readFile("./db/db.json", 'utf8', function(err, data){
            if(err){
                console.log(err);
                res.status(500).json('Error posting note');
                return;
            }
            let currentData = JSON.parse(data);
            currentData.push(newNote);
            let finalData = JSON.stringify(currentData)
                

            fs.writeFile('./db/db.json', finalData, (err) => {
                if(err){
                    console.error(err);
                    res.status(500).json('Error in posting note');
                    return
                }


                const response = {
                    status: 'success',
                    body: newNote
                };

                console.log(response);
                res.status(201).json(response)
            });
        });
    }else{
        res.status(500).json('Error in posting note')
    }
});


//Delete a selected note
app.delete("/api/notes/:id", (req, res) => {
    //Set id from parameters
    const id = req.params.id;
    
    //Read file, parse data, locate id in array and remove from array
    if(id){
        fs.readFile("./db/db.json", 'utf8', function(err, data){
                if(err){
                    console.log(err);
                    res.status(500).json('Error deleting note');
                    return;
                }
                let currentData = JSON.parse(data);
                for(let i = 0; i < currentData.length; i++){
                    if(currentData[i].id == id){
                        currentData.splice(i, 1)
                        break;
                    }
                }
                currentData = JSON.stringify(currentData);

                fs.writeFile('./db/db.json', currentData, (err) => {
                    if(err){
                        console.error(err);
                        res.status(500).json('Error in deleting note');
                        return
                    }


                    const response = {
                        status: 'success',
                        body: id
                    };

                    console.log(response);
                    res.status(201).json(response)
                });
            });
    }else{
        res.status(500).json('Error in deleting note')
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})


//listen
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);