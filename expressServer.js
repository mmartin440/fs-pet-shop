import express from  'express'
import { readPetsFile } from './shared.js' // ./ means local 
import fs from 'fs/promises'

const app = express(); 
const PORT = 3000; // we are just doing this incasse someone wants to change the port direction 
app.use(express.json()); // this only pasrses the incoming info from a Post request 
const unkownHttp = ((req, res, next) => {
    res.status(404).send('Not Found'); 
    next(); 
})

// .get itself is async and promise it self is async the dot then on promise is just an attachment to the async 
app.get('/pets', (req, res, next) => {
    readPetsFile().then((data) => {
        // console.log('data', data); 
        res.send(data); 
    }) 
    .catch(next);  // dot catch is part of a pormise, we are using it here to specifiy to exactly what we want it to after the error is catch 
}); 

app.get('/pets/:index', (req, res , next) => {
    readPetsFile().then((data) => {
        const index = req.params.index
        // console.log(req.params.index); 
        if(data[index]) {
            // console.log(data[index]); 
            // console.log(req.params); // req.params gives you a object waht they inputed after pets 
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
            return fs // we have to return because it wont know if its being returned 
            .writeFile('pets.json', JSON.stringify(data)).then( () =>{ // this is asycrincs
                res.set('Content-type', 'application/json')
                res.send(`Pet you have submitted: ${JSON.stringify(newPet)}`); 
                // res.send(JSON.stringify(newPet)); 
            }) 
        } else {
                 
            res.sendStatus(400)     
        }
    })
   .catch(next); 
}); 

app.use((err, req, res, next) => {
    res.sendStatus(500); 
}); 

// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); 
})

app.use(unkownHttp); 