const express = require("express")
const bodyParser = require('body-parser')

const app = express()
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

app.use(bodyParser.json())
models = require("./models")

app.get("/", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({"success": "Welcome to Recko", "error": ""});
})

app.get("/universe/:id/families", function(req, res){
    universeId = req.params.id;
    models.Person.findAll({
        attributes: ['family_id'],
        where: {
            universe_id: universeId,
        },
    }).then(function(persons) {
        res.json(persons);
    })
})

app.post("/persons", function(req, res) {
    // TODO: perform some validations
    universeId = req.body.universe_id;
    familyId = req.body.family_id;
    power = req.body.power;
    var payload = {
        universe_id: universeId,
        family_id: familyId,
        power: power,
    }

    models.Person.create(payload).then(function(person){
        res.json({'success': true, 'person': person})
    })

})


app.get("/family/:id/power", function(req, res) {
    var id = req.params.id;
    models.Person.findAll({
        attributes: ['family_id', 'universe_id', [models.sequelize.fn('count', models.sequelize.col('power')), 'power_count']],
        group: ['universe_id'],
        where: {
            family_id: id
        }
    }).then(function(persons) {
        var powers = [];
        for (person in persons) {
            power_count = persons[person].dataValues.power_count;
            powers.push(power_count);
        }
        var samePower = true;
        var power_min = persons[0].dataValues.power_count;
        for (power in powers) {
            if (power !== power_min) {
                samePower = false;
            }
        }
        res.json({'PowerLevelSame': samePower, 'family_id': id, 'success': true});
    })
})

app.get("/family/:id/balance", function(req, res) {
    var id = req.params.id
    models.Person.findAll({
        attributes: ['family_id', 'universe_id', [models.sequelize.fn('count', models.sequelize.col('power')), 'power_count']],
        group: ['universe_id'],
        where: {
            family_id: id,
        }
    }).then(function(persons) {
        var sum_powers = 0;
        for (person in persons) {
            sum_powers = sum_powers + persons[person].dataValues.power_count;
        }
        var avg_power = sum_powers/persons.length;
        res.json({'families': persons, 'avg_power': avg_power});
    })
});

app.listen(3000)

module.exports = app
