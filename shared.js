import fs from 'fs/promises'

export const readPetsFile = () => // we have export so other files can read it and its not limited to this file
    fs.readFile('pets.json', 'utf-8').then((data) => JSON.parse(data)); 
