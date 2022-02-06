const fs = require('fs')

const fileContents = fs.readFileSync('./data.txt').toString()

console.log(typeof fileContents)
