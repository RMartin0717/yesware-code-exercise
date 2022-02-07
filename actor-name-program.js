const fs = require('fs')
const fileContents = fs.readFileSync('./testData.txt').toString()
// const fileContents = fs.readFileSync('./data.txt').toString()


class ActorNameProgram {
  constructor(nameData) {
    this.nameData = this.structureData(nameData)
  }

  structureData(data) {
    const separatedNames = data.split('.\n')
    const orderedNames = separatedNames.sort()
    //consider using forEach instead of reduce?
    //maybe in favor of reduce for immutability
    const structuredNameData = orderedNames.reduce((acc, name) => {
      const splitLastName = name.split(', ')
      //last element in separatedNames array comes back as empty string because it splits at the period/line break and sometimes theres an empty line after
      if(!splitLastName[1]) {
        return acc
      } else {
        const lastName = splitLastName[0]
        const splitFirstName = splitLastName[1].split(' --')
        const firstName = splitFirstName[0]
        if(this.checkNameNotValid(lastName) || this.checkNameNotValid(firstName)) {
          return acc
        }
        const newName = { lastName: lastName, firstName: firstName }
        return [...acc, newName]
      }
    }, [])
    return structuredNameData
  }

  checkNameNotValid(name) {
    const splitName = name.toUpperCase().split('')
    const notValid = splitName.find(value => value.charCodeAt(0) < 65 || value.charCodeAt(0) > 90)
    if(notValid) {
      return true
    }
  }

  uniqueFullNameCount() {
    let counter = 0
    let previousName = { lastName: null, firstName: null }
    this.nameData.forEach(name => {
      if(previousName.lastName !== name.lastName || previousName.firstName !== name.firstName) {
        counter++
      }
      previousName = name
    })
    return counter
  }

  uniqueLastNameCount() {

  }

  uniqueFirstNameCount() {

  }

  mostCommonLastNames() {

  }

  mostCommonFirstNames() {

  }

  speciallyUniqueNames() {

  }

  modifiedNames() {

  }

  callAllOutptMethods() {

  }
}

const names = new ActorNameProgram(fileContents)
console.log(names.nameData)
console.log(names.uniqueFullNameCount())
