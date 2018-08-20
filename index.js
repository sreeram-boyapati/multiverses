const express = require("express")
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
models = require("./models")

/**
 * Takes the families with a particular id from all the universes
 * and balances the power to same level by adding more persons
 *
 */
const balanceFamilies = families => {
    // Map the families
    power_tuples = families.map(family => family.dataValues.power_count);

    var maxPower = 0;
    for (var index=0; index<power_tuples.length; index++) {
        if (power_tuples[index] > maxPower){
            maxPower = power_tuples[index];
        }
    }

    for (var index=0; index<families.length; index++)
    {
        addPowerToFamily(families[index], maxPower);
    }
}

function addPowerToFamily(family, maxPower) {
    power_count = family.dataValues.power_count;
    diffPower = maxPower - power_count;

    if (diffPower > 0) {
        for (var i=0; i<diffPower; i++){
            models.Person.create({
                'universe_id': family.dataValues.universe_id,
                'power': true,
                'family_id': family.dataValues.family_id
            });
        }
    }
}

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
        var samePower = true;
        var power_min = persons[0].dataValues.power_count;
        for (var i=0; i<persons.length; i++) {
            var cur_power = persons[i].dataValues.power_count;
            if (cur_power !== power_min) {
                samePower = false;
            }
        }
        res.json({'PowerLevelSame': samePower, 'families': persons, 'success': true});
    })
})

app.post("/family/:id/balance", function(req, res) {
    var familyId = req.params.id
    models.Person.findAll({
        attributes: ['family_id', 'universe_id', [models.sequelize.fn('count', models.sequelize.col('power')), 'power_count']],
        group: ['universe_id'],
        where: {
            family_id: familyId,
        }
    }).then(function(persons) {
        balanceFamilies(persons);
        res.json({'success': true});
    });
});

app.listen(3000)

module.exports = app
