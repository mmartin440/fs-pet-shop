import express from  'express'
import pg from 'pg'; 
import basicAuth from 'express-basic-auth'; 


const app = express(); 
const PORT = 3000; 

/* -----------------------MIDDLEWEAR-------------------------*/
app.use(express.json()); // parse the incoming information fro client 
app.use(basicAuth( { // to get the authorization from client 
    users: {
        'admin': 'meowmix'
    }, 
    unauthorizedResponse: getUnauthorizedResponse
}))
const unkownHttp = ((req, res, next) => { // this is incase you miss type incorrect url 
    res.sendStatus(404); // not found 404 
    console.log('unknowHttp was used 404')
    next(); 
})

/* -------------------------------------------------*/
function getUnauthorizedResponse(req) { // if you incorreclty input the username and password
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

const pool = new pg.Pool({ // you need this to be able to use the pool query 
    database: 'petshop',
  })


/* -------------------------------------------------*/
  app.get('/pets', (req, res, next) => { 
    pool.query("SELECT * FROM pets").then((data) => { // you are reteriving all (*) the rows from the table pets 
        res.send(data.rows); // returns the data in the row selected from the table 
        // pool.end() // you dont use the pool.end() if you want to stay safe 
      })
      .catch(next); 
})

app.get('/pets/:id', (req,res, next) => {
    const id = req.params.id; 
    pool.query('SELECT * FROM pets WHERE id = $1;' , [id]).then((data) => {
         const pet = data.rows[0]; 
         if(pet){ 
            res.send(pet); 
         } else {
            res.sendStatus(400); // bad request 
         }
    })
    .catch(next); 
})



app.post('/pets', (req, res, next) => {
    const addPet = req.body; 
        if(addPet.name && addPet.kind && addPet.age) {
           pool.query("INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *; ", [addPet.name, addPet.kind, addPet.age]).then((data) => {
            res.status(201).send(addPet);
           }) .catch(next); 
        } else {
            res.sendStatus(400); // we have this here in case the person missed spelled one of the keys 
        }
    
})

app.patch('/pets/:id', (req, res, next) => {
    const id = req.params.id; 
    const {name, kind, age} = req.body; 
    // edge cases -->  index doesnt exist , wrong format 
// COALESSCE  is used when you want to take in a argument/value into the row 
// in our case we used name = COALESCE($1, name), the $1 is a place holder and after that the name incase if the client deosn't want to update the specific info  
        pool.query(
           `UPDATE pets
            SET name = COALESCE($1, name), 
                kind = COALESCE($2, kind),
                age = COALESCE($3, age)
            WHERE id = $4  RETURNING *`, 
                [name, kind, age, id] // here is where you put the actual vcalues you want to be passed through 
        ).then((data) => {
            if(data.rows.length === 0) { // if the data is no longer there then we give back resposne of 404 to the client for them to know they already deleted 
                res.status(404);  
            } else {
                res.status(200).send(data.rows[0]); // we used a RETURNING * becuase we want to be sure when we respond back to that was updated 
            }
        }) .catch(next); 
})


app.delete('/pets/:id', (req, res, next) => {
    const id = req.params.id; 
    pool.query("DELETE FROM pets WHERE id = $1 RETURNING *; ", [id]).then((data) => {
        if(data.rows.length === 0) { // this is here to
            res.sendStatus(404);  
        } else {
            res.sendStatus(204); 
        }
    }). catch(next); 
})









app.use((err, req, res, next) => {
    res.sendStatus(500); 
}); 

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); 
})

app.use(unkownHttp); 