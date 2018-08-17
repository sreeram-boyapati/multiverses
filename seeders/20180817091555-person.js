'use strict';


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomBool() {
  return Math.random() >= 0.5;
}

function getRandomPersons() {
    var persons = [];
    for (var i=1; i<=190; i++){
      var person = {
	        family_id: getRandomInt(1, 15),
          universe_id: getRandomInt(1, 5),
          power: getRandomBool(),
      }
      persons.push(person);
    }
    return persons;
}

module.exports = {
  up: (queryInterface, Sequelize) => {
	  var persons = getRandomPersons();
	  return queryInterface.bulkInsert('Person', persons, {});
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Person', null, {});
  }
};
