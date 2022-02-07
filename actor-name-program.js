const fs = require('fs')
const fileContents = fs.readFileSync('./testData.txt').toString()
// const fileContents = fs.readFileSync('./data.txt').toString()


class ActorNameProgram {
  constructor(nameData) {
    this.nameData = this.structureData(nameData)
    // this.nameData = (typeof fileContents)
  }

  structureData(data) {
    const separatedNames = data.split('.\n')
    const orderedNames = separatedNames.sort()
    //consider using forEach instead of reduce?
    const structuredNameData = orderedNames.reduce((acc, name) => {
      const splitLastName = name.split(', ')
      if(!splitLastName[1]) {
        return acc
      } else {
        const lastName = splitLastName[0]
        const splitFirstName = splitLastName[1].split(' --')
        const firstName = splitFirstName[0]
        const newName = { lastName: lastName, firstName: firstName }
        return [...acc, newName]
      }
    }, [])
    return structuredNameData
  }

  uniqueFullNameCount() {

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
