import fs from 'fs'; 
import { readFile} from 'fs/promises'; 
import { writeFile } from 'fs/promises'; 

const subcommand = process.argv[2];  
// console.log(process.argv); 

switch(subcommand) {
    case 'read': {    
        const index1 = process.argv[3]; 
        readFile('pets.json', 'utf-8').then(str => { // this reads your data and utf-8 converts it letter for you 
            const data = JSON.parse(str); // we created into useable data , in our case we have an array
            if(index1 === undefined) { // if there is no index then you just return regualr data 
                console.log('No specified index: ', data);
            }else if(data[index1] === undefined) { // if the given index doesn't exist then return index not found 
                console.error('Running error: Index not found');
            } else { // else you just return the data at the given index 
                console.log('Data: ', data[index1]); 
            }     
        }); 
        break; 
    }
    case 'create':
        // this is us creating the inputs into the process 
        const inputAge = process.argv[3]; // or you can const age = parseInt(process.argv[3]);
        const inputKind = process.argv[4]; 
        const inputName = process.argv[5];
        const newPet = { // we created an object that we can later on push into our array 
            age : Number(`${inputAge}`) ,
            kind : inputKind, 
            name : inputName
        }

        if(inputAge === undefined || inputKind === undefined || inputName === undefined){
            console.log('Usage: node pets.js create AGE KIND NAME'); 
            process.exit(1)
        }else {
            readFile('pets.json', 'utf-8').then(str => { // we using readFile again because we want to push new info into the data
                const data = JSON.parse(str);
                data.push(newPet);  // since our data we retrive is an array we can just push the new object into it 
                const newData = JSON.stringify(data) // the new data we need to convert it back to what was before we parsed it 
                writeFile('pets.json', newData).then(() =>{}) // then writeFile updates the new information back into the file you wanted to update
        }); 
        }
        break; 
    case 'update':
        const index = process.argv[3];
        const ageInput = parseInt(process.argv[4])
        const kindInput = process.argv[5];
        const nameInput = process.argv[6];

        if(index === undefined || ageInput === undefined || kindInput === undefined || nameInput === undefined){
            console.log('Usage: node pets.js update index AGE KIND NAME'); 
            process.exit(1)
        }else {
            readFile('pets.json', 'utf-8').then(str => { // we using readFile again because we want to push new info into the data
                const data = JSON.parse(str);
                 if(data[index]) {
                    const pet = data[index]; 
                    pet.age = ageInput; 
                    pet.kind = kindInput; 
                    pet.name = nameInput; 
                 }
                const newData = JSON.stringify(data) // the new data we need to convert it back to what was before we parsed it 
                writeFile('pets.json', newData).then(() =>{}) // then writeFile updates the new information back into the file you wanted to update
        }); 
        }
        break; 
    case 'destroy':
        const destoryIndex = process.argv[3];
        if(index === undefined ){
            console.log('Usage: node pets.js destroy Index'); 
            process.exit(1)
            readFile('pets.json', 'utf-8').then(str => { // we using readFile again because we want to push new info into the data
                const data = JSON.parse(str);
                
                 if(data[destoryIndex]) {
                    let deletePet = data[destoryIndex]; 
                    delete(deletePet); 
                 }
                const newData = JSON.stringify(data) // the new data we need to convert it back to what was before we parsed it 
                writeFile('pets.json', newData).then(() =>{}) // then writeFile updates the new information back into the file you wanted to update
        }); 
        }
        break; 
    default: {
        console.log('Usage: node pets.js [read | create | update | destroy]'); 
    }
}