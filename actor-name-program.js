const fs = require('fs')
const fileContents = fs.readFileSync('./data.txt').toString()
// const fileContents = fs.readFileSync('./data.txt').toString()


class ActorNameProgram {
  constructor(nameData) {
    this.nameData = this.structureData(nameData)
    //Data is stored as an object containing two key-value pairs, nameDataByLastName and nameDataByFirstName.
      //These keys are assigned to arrays of name objects, sorted by last name and first name respecitvely.
        //Each element in the arrays have the key-value pairs, lastName and firstName.
    //It is not memory efficient to store multiple copies of all of the data.
    //I would like to do more research into efficient ways of structuring data for these reasons.
    //In the context of a Javascript class component,
      //I chose this structure in order be more time efficient
      //I chose to organize the data by last name and then create a copy of it organized by first name
        //Given that access to an array sorted by first names improved efficiency of the uniqueFirstNameCount and mostCommonFirstNames methods
  }

  structureData(data) {
    const separatedNames = data.split('.\n')
    const orderedNames = separatedNames.sort()
    //consider using forEach instead of reduce?
    //maybe in favor of reduce for immutability
    const nameDataByLast = orderedNames.reduce((acc, name) => {
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

    const namesCopy = nameDataByLast.slice()
    //created a copy of the array since .sort() mutates the original array
    const nameDataByFirst = namesCopy.sort((a,b) => a.firstName.localeCompare(b.firstName))

    return { nameDataByLastName: nameDataByLast, nameDataByFirstName: nameDataByFirst }
  }

  checkNameNotValid(name) {
    const splitName = name.toUpperCase().split('')
    const notValid = splitName.find(value => value.charCodeAt(0) < 65 || value.charCodeAt(0) > 90)
    if(notValid) {
      return true
    }
  }

  uniqueFullNameCount() {
    let fullNameCounter = 0
    let previousName = { lastName: null, firstName: null }
    this.nameData.nameDataByLastName.forEach(name => {
      if(previousName.lastName !== name.lastName || previousName.firstName !== name.firstName) {
        fullNameCounter++
      }
      previousName = name
    })
    return fullNameCounter
  }

  uniqueLastNameCount() {
    let lastNameCounter = 0
    let previousName = { lastName: null }
    this.nameData.nameDataByLastName.forEach(name => {
      if(previousName.lastName !== name.lastName) {
        lastNameCounter++
      }
      previousName = name
    })
    return lastNameCounter
  }

  uniqueFirstNameCount() {
    let lastNameCounter = 0
    let previousName = { firstName: null }
    this.nameData.nameDataByFirstName.forEach(name => {
      if(previousName.firstName !== name.firstName) {
        lastNameCounter++
      }
      previousName = name
    })
    return lastNameCounter
  }

  mostCommonNames(firstOrLastName, nameDataByFirstOrLastName) {
    let previousName = null
    const repeatedNames = this.nameData[nameDataByFirstOrLastName].reduce((acc, name) => {
      if(name[firstOrLastName] === previousName && !acc[name[firstOrLastName]]) {
        acc[name[firstOrLastName]] = { name: name[firstOrLastName], count: 1}
      }
      if(name[firstOrLastName] === previousName && acc[name[firstOrLastName]]) {
        acc[name[firstOrLastName]].count ++
      }
      previousName = name[firstOrLastName]
      return acc
    }, {})

    const nameCounts = Object.entries(repeatedNames)
    const orderedByCount = nameCounts.sort((a,b) => b[1].count - a[1].count)
    const firstTen = orderedByCount.slice(0, 10)
    return firstTen
  }

  speciallyUniqueNames() {

  }

  modifiedNames() {

  }

  callAllOutptMethods() {

  }
}

const names = new ActorNameProgram(fileContents)
// console.log(names.nameData)
// console.log(names.uniqueFullNameCount())
// console.log(names.uniqueLastNameCount())
// console.log(names.uniqueFirstNameCount())
console.log(names.mostCommonNames('lastName', 'nameDataByLastName'))
console.log(names.mostCommonNames('firstName', 'nameDataByFirstName'))
