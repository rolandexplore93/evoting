require("dotenv").config(); // Enable access to environment variables
const mongoose = require("mongoose");
// Establish connection to the database
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to database')
}).catch(err => {
    console.error(err.message + ": Unable to connect to the database")
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message)
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected')
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
