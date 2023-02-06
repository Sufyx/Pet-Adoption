/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT || 6060;
const app = express();
app.use(cors({ credentials: true }));
app.use(express.json());

const petsRoute = require("./routes/petsRoute");
const usersRoute = require("./routes/usersRoute");
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


