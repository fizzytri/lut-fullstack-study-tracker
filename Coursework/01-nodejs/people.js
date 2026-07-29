class Person {
  constructor(name, age, email) {
    this.name = name
    this.age = age
    this.email = email
  }

  greeting() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`
  }
}

const people = [
  new Person('Ada Lovelace', 36, 'ada@example.com'),
  new Person('Alan Turing', 41, 'alan@example.com'),
  new Person('Grace Hopper', 85, 'grace@example.com'),
]

const averageAge = (list) =>
  Math.round(list.reduce((sum, person) => sum + person.age, 0) / list.length)

module.exports = { Person, people, averageAge }
