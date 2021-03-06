const fs = require('fs')
const fileContents = fs.readFileSync('./data.txt').toString()

class ActorNameProgram {
  constructor(nameData) {
    this.nameData = this.structureData(nameData)
    this.uniqueNames = []
    //nameData is stored as an object containing three key-value pairs, nameData, nameDataByLastName and nameDataByFirstName.
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

    const nameDataUnordered = separatedNames.reduce((acc, name) => {
      const splitLastName = name.split(', ')
      //The last element in separatedNames array sometimes comes back as empty string because it splits at the period/line break and sometimes theres an empty line after. The following conditional handles this
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
    //By storing names in alphabetical order in state by last name and iterating once over the array,
    //this method is (and the following 2 methods are) able to check the current name being iterated over against the previous name
    //using a variable to keep count and another variable to store only the previous name that was iterated over
    let fullNameCounter = 0
    let previousName = { lastName: null, firstName: null }
    this.nameData.nameDataByLastName.forEach(name => {
      if(previousName.lastName !== name.lastName || previousName.firstName !== name.firstName) {
        fullNameCounter++
      }
      previousName = name
    })
    return `There are ${fullNameCounter} unique full names`
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

    let firstOrLast = firstOrLastName.split('Name')[0]

    return `There are ${nameCounter} unique ${firstOrLast} names`
  }

  mostCommonNames(firstOrLastName, nameDataByFirstOrLastName) {
    //This method requires one of the following sets of parameters
      //'lastName', 'nameDataByLastName'
      //'firstName', 'nameDataByFirstName'
    let previousName = null
    const repeatedNames = this.nameData[nameDataByFirstOrLastName].reduce((acc, name) => {
      //Only stores a name that has already been repeated. Eliminates storage of names that only appear once
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

    let firstOrLast = firstOrLastName.split('Name')[0]
    let formatList = firstTen.map(name => {
      return `\n ${name[1].count} instances of ${name[1].name}`
    })

    return `The 10 most common ${firstOrLast} names are:${formatList}`
  }

  getSpeciallyUniqueNames(n) {
    //When run for the first time with a specific value for n, stores specially unique names as state
    //If it has been run before with that same amount, it exits out
    //Methods that use this information run this method and then look to stored state
    //State is reset if a new value for n is needed
    if(this.uniqueNames.length === n) {
      return
    }
    let uniqueNames = []
    let usedFirstNames = []
    let usedLastNames = []

    //Used a for loop in order to exit out of the function once n specially unique names are found
    //OR to exit out of the function in the instance that there are no more names in the original dataset to iterate over but the number of specially unique names is not yet met
    for (let i = 0; uniqueNames.length < (n) && i < this.nameData.nameDataUnordered.length; i++) {
      if(!usedFirstNames.includes(this.nameData.nameDataUnordered[i].firstName) &&
        !usedLastNames.includes(this.nameData.nameDataUnordered[i].lastName)) {
          uniqueNames.push(this.nameData.nameDataUnordered[i])
      }
        usedLastNames.push(this.nameData.nameDataUnordered[i].lastName)
        usedFirstNames.push(this.nameData.nameDataUnordered[i].firstName)
    }
    this.uniqueNames = uniqueNames
    return
  }

  speciallyUniqueNames(n) {
    this.getSpeciallyUniqueNames(n)

    let formatUniqueNames = this.uniqueNames.map(name => {
      return `\n  ${name.lastName}, ${name.firstName}`
    })
    return `The ${n} specially unique names are:${formatUniqueNames}`
  }

  modifiedNames(n) {
    this.getSpeciallyUniqueNames(n)
    let firstFirstName = this.uniqueNames[0].firstName
    const modifyNames = this.uniqueNames.map((name, index) => {
      if(index < this.uniqueNames.length - 1) {
        return { lastName: name.lastName, firstName: this.uniqueNames[index + 1].firstName }
      } else {
        return { lastName: name.lastName, firstName: firstFirstName }
      }
      return
    })

    let formatModifyNames = modifyNames.map(name => {
      return `\n  ${name.lastName}, ${name.firstName}`
    })
    return `The ${n} modified names are:${formatModifyNames}`
  }
}

const names = new ActorNameProgram(fileContents)
// console.log(names.nameData)
console.log(names.uniqueFullNameCount())
console.log(names.uniqueNameCount('lastName', 'nameDataByLastName'))
console.log(names.uniqueNameCount('firstName', 'nameDataByFirstName'))
console.log(names.mostCommonNames('lastName', 'nameDataByLastName'))
console.log(names.mostCommonNames('firstName', 'nameDataByFirstName'))
console.log(names.speciallyUniqueNames(25))
console.log(names.modifiedNames(25))

// OUTPUT:

// There are 49110 unique full names
// There are 467 unique last names
// There are 3006 unique first names
// The 10 most common last names are:
//  143 instances of Barton,
//  136 instances of Lang,
//  135 instances of Ortiz,
//  134 instances of Hilll,
//  130 instances of Hills,
//  129 instances of Batz,
//  129 instances of Terry,
//  128 instances of Johns,
//  128 instances of Romaguera,
//  127 instances of Crist
// The 10 most common first names are:
//  31 instances of Andreanne,
//  31 instances of Keon,
//  31 instances of Stephania,
//  31 instances of Tara,
//  30 instances of Baron,
//  30 instances of Heath,
//  30 instances of Kaycee,
//  30 instances of Milo,
//  30 instances of Summer,
//  30 instances of Ulices
// The 25 specially unique names are
//   Graham, Mckenna,
//   Marvin, Garfield,
//   McLaughlin, Mariah,
//   Lang, Agustina,
//   Bradtke, Nikko,
//   Adams, Luis,
//   Lehner, Matilde,
//   Ortiz, Anita,
//   Koch, Berry,
//   Cartwright, Nicolas,
//   Fisher, Elmo,
//   Kunze, Gertrude,
//   Stanton, Davin,
//   Runolfsdottir, Roy,
//   Rogahn, Colby,
//   Tromp, Ryley,
//   Hoppe, Stanley,
//   Shanahan, Bethel,
//   Hills, Samanta,
//   McGlynn, Thad,
//   Lynch, Norma,
//   Bahringer, Lennie,
//   Tillman, Madison,
//   Stoltenberg, Donna,
//   Dickinson, Sonya
// The 25 modified names are
//   Graham, Garfield,
//   Marvin, Mariah,
//   McLaughlin, Agustina,
//   Lang, Nikko,
//   Bradtke, Luis,
//   Adams, Matilde,
//   Lehner, Anita,
//   Ortiz, Berry,
//   Koch, Nicolas,
//   Cartwright, Elmo,
//   Fisher, Gertrude,
//   Kunze, Davin,
//   Stanton, Roy,
//   Runolfsdottir, Colby,
//   Rogahn, Ryley,
//   Tromp, Stanley,
//   Hoppe, Bethel,
//   Shanahan, Samanta,
//   Hills, Thad,
//   McGlynn, Norma,
//   Lynch, Lennie,
//   Bahringer, Madison,
//   Tillman, Donna,
//   Stoltenberg, Sonya,
//   Dickinson, Mckenna
