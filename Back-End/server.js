/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 16/08/2022
 * Asaf Gilboa
*/

const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const petsRoute = require("./routes/petsRoute");
const usersRoute = require("./routes/usersRoute");

const PORT = process.env.PORT || 6060;
const app = express();
app.use(cookieParser());

// app.use(cors({origin:"localhost:3000", credentials:true}));
app.use(cors({credentials:true}));
app.use(express.json());

app.use("/pet", petsRoute);
app.use("/users", usersRoute);

mongoose.connect("mongodb://localhost/petsAdoptionDB", () => {
    console.log("Mon Goosed");
}, e => console.error(e));

app.get("/", async (req, res) => {
    try {
        res.send(" :) ");
    } catch (err) {
        console.log('err: ', err);
        res.status(500).send(err.message);
    }
});


app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
});
