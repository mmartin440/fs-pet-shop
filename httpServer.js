import http from 'http'; 
import { readPetsFile } from './shared.js' // we added the outsources part in another file 
import fs from 'fs/promises'; // the promises we created in our code like .then 

const petRegExp = /^\/pets\/(.*)$/; // regualr expression allows us to get the person input in the request 

const server = http.createServer((req, res) => { // this is where we can use the request and response 
   // we are using a if statment to check the person inoput 
    if(req.url ==='/pets' && req.method === 'GET') { // we are making sure that their URL and method are waht we are requesting for 
            readPetsFile().then((data) => { // if its a GET method and its the url then we can read our data that we have stored in a seperate file 
            // fucntion readPetsFIle() already parsed our data so we can read it as an array (in our case)
            let newData = JSON.stringify(data); // since we arent doing nothing to data we just want to send it to the person who asked for it we just put it back into a string usiung JSON.stringify()
            console.log('respond back with DATA',newData); 
            res.end(newData); // res.end means that we respond back and end the waiting on their side, we just responded back with data they asked for which is the entire info
        })
        console.log('passed the first if statment')
    } else if(petRegExp.test(req.url) === true && req.method === 'GET') { // .test() 
        // console.log(req.url.match(petRegExp)[1]); // match compares a string to a regualr expression
        const newIndex = req.url.match(petRegExp)[1]; // this gives me the index the person wanted info on
        // console.log('request URL: ', req.url); // this the url i received from the person 
        // console.log('.match() method: ', req.url.match(petRegExp)); // returns me an array that breaks the input into multiple sections and then you can look specificly for the information you are looking for [ '/pets/0', this one we want ->'0', index: 0, input: '/pets/0', groups: undefined ]
        // console.log('.test() method: ', petRegExp.test(req.url)); // returns me a boolean 
        readPetsFile().then((data) => { //  
            if(data[newIndex] !== undefined){  // if the index is in the data that why we said not undefined 
                res.setHeader('Content-Type' , 'application/json'); // the we responde back with somthing in th header 
                 res.end(JSON.stringify(data[newIndex])); // respond with the data at that current index in the response area
            } else { // ortherwise we give them an error 
                res.setHeader('Content-Type' , 'text/plain'); 
                res.statusCode = 404; 
                res.end('NOT FOUND')
            }
        })
        }else if(req.url ==='/pets' && req.method === 'POST') { // method post is them trying to add somthing the data 
            let body = ""; // a place holder where we can add the data to 
            req.on('data', (chunk) => { // we have data is a string, they are key words like mouseover, mouseenter
                body += chunk; // chunck is the piece of information they are giving us in the body JSON conentent from the client 
            })
            req.on('end', () => { // req.on is kind of an event listner 
             const newPet = JSON.parse(body); // we gotta make sure we turned the incoming info into a array 
             const agePet = Number(newPet.age) // since the infroamtion being put the termianl is oly strings we have to make sure to convert into a number 
             newPet.age = agePet // we are just reassigning the value(which is a string ) into a new value(a number)
            //  console.log('newPet', Number(newPet.age)); 
            readPetsFile().then((data) => { 
                data.push(newPet); // then we want to push the new pet info into the data 
                return fs
                .writeFile('pets.json', JSON.stringify(data)) // this is directting where this data path is going
                .then(() => {
                    res.setHeader('Content-Type' , 'application/json'); 
                    res.end('This is what you inputed: ', JSON.stringify(newPet)) // we just returned the info we received from them in their resposne 
                })

            }) 
        })
    }
    else {
        res.writeHead(404); 
        res.end('INCLUDE YOUR PATH'); // this is a test chase jsut incase we missed any edge cases 
    }
})

server.listen(3000, () => {
    console.log('server starting on port 3000')
})

















// POST: body doesnt exit so you cant just request it, you have to get it as a string first , each chunk is a string 
// 

// parse the string into object or array

// you cant send a object or array back so you need to stringify it 
