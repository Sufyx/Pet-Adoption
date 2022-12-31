/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 16/08/2022
 * Asaf Gilboa
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const petsRoute = require("./routes/petsRoute");
const usersRoute = require("./routes/usersRoute");

const PORT = process.env.PORT || 6060;

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(express.json());
app.use("/pet", petsRoute);
app.use("/users", usersRoute);


mongoose
    .connect(process.env.URI, 
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Database connected`);
        app.listen(PORT, () => {
            console.log(`Listening on localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });


app.get("/", async (req, res) => {
    try {
        res.send(" :) ");
    } catch (err) {
        console.log('err: ', err);
        res.status(500).send(err.message);
    }
});


