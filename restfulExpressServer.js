import express from  'express'
import { readPetsFile } from './shared.js'
import fs from 'fs/promises'

const app = express(); 
const PORT = 3000; 
app.use(express.json()); 
const unkownHttp = ((req, res, next) => {
    res.sendStatus(404); 
    next(); 
})


app.get('/pets', (req, res, next) => { 
    readPetsFile().then((data) => {
        res.send(data); 
    }) 
    .catch(next); 
}); 

app.get('/pets/:index', (req, res , next) => {
    readPetsFile().then((data) => {
        const index = req.params.index
        // console.log(req.params.index); 
        if(data[index]) {
            // console.log(data[index]); 
            // console.log(req.params); 
            res.send(data[index]); 
        } else {
            res.status(404).send(`INDEX ${index} NOT FOUND`); 
        }
    })
    .catch(next); 
}); 

app.post('/pets', (req, res , next) => {
    console.log('Post request', req.body); 
    const newPet = req.body; 
    newPet.age = Number(newPet.age); 
    readPetsFile().then((data) => {
        if(newPet.age && newPet.kind && newPet.name) {
            data.push(newPet); 
            return fs 
            .writeFile('pets.json', JSON.stringify(data)).then( () =>{ 
                res.set('Content-type', 'application/json')
                res.status(201).send(`Pet you have submitted: ${JSON.stringify(newPet)}`); 
               
                
            }) 
        } else {
                 
            res.sendStatus(400)     
        }
    })
   .catch(next); 
}); 

app.patch('/pets/:index', (req, res, next) => {
    const index= req.params.index; 
    const update = req.body
    // console.log('index', index);
    // console.log('update', update);
    // console.log('key update', Object.keys(update));

    readPetsFile().then((data) => { 
        // console.log('key data', Object.keys(data[index]));
        if(data[index]) {
              if (update.age){
                data[index].age = update.age;
            }else if(update.kind) {
                data[index].age = update.age;
            } else if(update.name) {
                data[index].name = update.name;
            } else {
                res.sendStatus(400); 
            }
                return fs 
            .writeFile('pets.json', JSON.stringify(data)).then( () =>{ 
                res.set('Content-type', 'application/json')
                res.send(`you did somthing`); 
               
            }) 
        } else {
            res.sendStatus(404); 
        }
    })
    .catch(next); 
}); 

app.delete('/pets/:index', (req, res, next) => {
    const deleteIndex = req.params.index; 
    readPetsFile().then((data) => { 
        if(data[deleteIndex]) {
            let deleted = data.splice(deleteIndex,1); 
            return fs 
            .writeFile('pets.json', JSON.stringify(data)).then( () =>{ 
                res.set('Content-type', 'application/json')
                res.send(`Delted: ${JSON.stringify(deleted)}`); 
            }) 
        } else {
            res.sendStatus(404); 
        }
    })
    .catch(next); 
}); 



app.use((err, req, res, next) => {
    res.sendStatus(500); 
}); 

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); 
})

app.use(unkownHttp); 