const fs = require('fs')
const fileContents = fs.readFileSync('./testData.txt').toString()
// const fileContents = fs.readFileSync('./data.txt').toString()


class ActorNameProgram {
  constructor(nameData) {
    this.nameData = this.structureData(nameData)
    //Data is stored as an object containing three key-value pairs, nameData, nameDataByLastName and nameDataByFirstName.
      //These keys are assigned to arrays of name objects. nameData contains the reformated names in the same order as originally given. nameDataByLastName and nameDataByFirstName sort all of the names by last name and first name respecitvely.
        //Each element in the arrays have the key-value pairs, lastName and firstName.
    //It is not memory efficient to store multiple copies of all of the data.
    //I would like to do more research into efficient ways of structuring data to save on space/memory
    //In the context of a Javascript class component,
      //I chose this structure in order be more time efficient
      //I chose to reformat the data so that each name datapoint was its own object and then created copies of the array of names to organize it by first and last name
        //Given that access to an existing array would improve time efficiency sorting by first names and last names in the majority of the methods
  }

  structureData(data) {
    const separatedNames = data.split('.\n')
    //consider using forEach instead of reduce?
    //maybe in favor of reduce for immutability
    const nameDataUnordered = separatedNames.reduce((acc, name) => {
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

    const nameDataByLast = nameDataUnordered.slice().sort((a,b) => a.lastName.localeCompare(b.lastName))
    const nameDataByFirst = nameDataUnordered.slice().sort((a,b) => a.firstName.localeCompare(b.firstName))

    return {
      nameDataUnordered: nameDataUnordered,
      nameDataByLastName: nameDataByLast,
      nameDataByFirstName: nameDataByFirst
    }
  }

  checkNameNotValid(name) {
    const splitName = name.toUpperCase().split('')
    const notValid = splitName.find(value => value.charCodeAt(0) < 65 || value.charCodeAt(0) > 90)
    if(notValid) {
      return true
    }
  }

  uniqueFullNameCount() {
    //By storing names in alphabetical order by last name and iterating once over the array,
    //this method is able to check the current name being iterated over against the previous name
    //using a variable to keep count and another variable to store only the previous name that was iterated over
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

  uniqueNameCount(firstOrLastName, nameDataByFirstOrLastName) {
    //This method requires one of the following sets of parameters
      //'lastName', 'nameDataByLastName'
      //'firstName', 'nameDataByFirstName'
    let nameCounter = 0
    let previousName = { [firstOrLastName]: null }
    this.nameData[nameDataByFirstOrLastName].forEach(name => {
      if(previousName[firstOrLastName] !== name[firstOrLastName]) {
        nameCounter++
      }
      previousName = name
    })
    return nameCounter
  }

  mostCommonNames(firstOrLastName, nameDataByFirstOrLastName) {
    //This method requires one of the following sets of parameters
      //'lastName', 'nameDataByLastName'
      //'firstName', 'nameDataByFirstName'
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

  speciallyUniqueNames(n) {
    let uniqueNames = []
    let usedFirstNames = []
    let usedLastNames = []

    for (let i = 0; uniqueNames.length < (n + 1) && i < this.nameData.nameDataUnordered.length; i++) {
      if(!usedFirstNames.includes(this.nameData.nameDataUnordered[i].firstName) &&
        !usedLastNames.includes(this.nameData.nameDataUnordered[i].lastName)) {
          uniqueNames.push(this.nameData.nameDataUnordered[i])
      }
        usedLastNames.push(this.nameData.nameDataUnordered[i].lastName)
        usedFirstNames.push(this.nameData.nameDataUnordered[i].firstName)
    }
    return uniqueNames
  }

  modifiedNames() {
    // First save first element’s first name as variable and when last element is reached, assign that first name to the initial first name. Iterate over last names and create array reassigning the first names to the first name of the next element
  }

  callAllOutptMethods() {

  }
}

const names = new ActorNameProgram(fileContents)
// console.log(names.nameData)
// console.log(names.uniqueFullNameCount())
// console.log(names.uniqueNameCount('lastName', 'nameDataByLastName'))
// console.log(names.uniqueNameCount('firstName', 'nameDataByFirstName'))
// console.log(names.mostCommonNames('lastName', 'nameDataByLastName'))
// console.log(names.mostCommonNames('firstName', 'nameDataByFirstName'))
console.log(names.speciallyUniqueNames(25))
