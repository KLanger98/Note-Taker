const api = require('express').Router();
const uuid = require('../helpers/uuid');
const fs = require('fs');

//Route path to GET notes.json 
api.get("/", (req, res) => {
    fs.readFile('./db/db.json', "utf8", (err, data) =>{
        if(err){
            console.error(err);
            res.status(500).json({error: 'Failed to read data'});
            return
        }

        try {
            const noteData = JSON.parse(data);
            console.log(`Successfully fetched db.json file data`)
            res.status(200).json(noteData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
})

//Route path to POST new note
api.post("/", (req, res) => {
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

                console.log(`Successfully written note to db.json`)
                res.status(201).json(response)
            });
        });
    }else{
        res.status(500).json('Error in posting note')
    }
});


//Delete a selected note
api.delete("/:id", (req, res) => {
    //Set id from parameters
    const id = req.params.id;
    
    //Read file, parse the data, locate id in array and remove from array
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

                    console.log(`Successfully performed ${req.method} for ${id}`)
                    res.status(201).json(response)
                });
            });
    }else{
        res.status(500).json('Error in deleting note')
    }
});

module.exports = api;