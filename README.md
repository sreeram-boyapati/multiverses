MULTIVERSE POC FOR RECKO

# INSTALLATION
Start a local mysql server with `root` and `root` and create a db `recko`
1. Run `npm install`
2. Run the migrations `node_modules/.bin/sequelize db:migrate` 
3. Run the seeder `node_modules/.bin/sequelize db:seed:all`
4. Start the server using `npm start` at port 3000


# Frameworks Used

Node v9
Sequelize
Express

## API

Schema

Person
----------
ID
POWER
FAMILY_ID
UNIVERSE_ID

1. GET `/universe/:id/families` - To get all the families in a particular universe
2. GET `/family/:id/power` - To get the sum of all power of families in each particular universe
3. POST `/persons` - To store a person profile in the database
4. POST `/family/:id/balance` - Balance the power of a family across all universes