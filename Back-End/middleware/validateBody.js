/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 19/08/2022
 * Asaf Gilboa
*/

const Ajv = require("ajv");
const ajv = new Ajv();

function validateBody(schema) {
  return (req, res, next) => {
    // console.log(" validateBody req ", req.body);
    let userId = '';
    if (req.body.userId) {
      userId = req.body.userId;
      delete req.body.userId;
    }
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      console.log("ajv.errors- ", ajv.errors[0]);
      res.status(400).send(ajv.errors[0]);
      return;
    }
    req.body.userId = userId;
    next();
  };
}

module.exports = { validateBody }
