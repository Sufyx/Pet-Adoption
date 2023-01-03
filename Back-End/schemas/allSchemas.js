/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 19/08/2022
 * Asaf Gilboa
*/


const signUpSchema = {
  type: "object",
  properties: {
    firstName: {type: "string", maxLength: 30},
    lastName: {type: "string", maxLength: 30},
    email: {type: "string", minLength: 5, maxLength: 50},
    password: {type: "string", minLength: 4, maxLength: 50},
    passwordConfirm: {type: "string", minLength: 4, maxLength: 50},
    phone: {type: "string", maxLength: 40}
  },
  required: ["email"],
  additionalProperties: false
}

const updateSchema = {
  type: "object",
  properties: {
    firstName: {type: "string", maxLength: 30},
    lastName: {type: "string", maxLength: 30},
    email: {type: "string", maxLength: 50},
    password: {type: "string", maxLength: 50},
    passwordConfirm: {type: "string", maxLength: 50},
    phone: {type: "string", maxLength: 40},
    bio: {type: "string", maxLength: 300},
    userId: {type: "string"}
  },
  additionalProperties: false
}

const loginSchema = {
  type: "object",
  properties: {
    email: {type: "string", minLength: 5},
    password: {type: "string", minLength: 2},
  },
  required: ["email", "password"],
  additionalProperties: false
}


const newPetSchema = {
    type: "object",
    properties: {
        type: { type: "string", minLength: 2, maxLength: 20 },
        name: { type: "string", minLength: 1, maxLength: 40 },
        adoptionStatus: { type: "string", minLength: 2, maxLength: 15 },
        picture: { type: "string", maxLength: 300},
        height: { type: "integer", maximum: 1000 },
        weight: { type: "integer", maximum: 1000 },
        color: { type: "string", maxLength: 15 },
        bio: { type: "string", maxLength: 300 },
        hypoallergenic: { type: "boolean" },
        dietary: { type: "array", items: { type: "string" }, uniqueItems: true },
        breed: { type: "string", minLength: 2, maxLength: 30 }
    },
    additionalProperties: false
}

  const updatePetSchema = {
    type: "object",
    properties: {
        type: { type: "string", maxLength: 20 },
        name: { type: "string", maxLength: 40 },
        adoptionStatus: { type: "string", maxLength: 15 },
        picture: { type: "string", maxLength: 300},
        height: { type: "integer", maximum: 1000 },
        weight: { type: "integer", maximum: 1000 },
        color: { type: "string", maxLength: 15 },
        bio: { type: "string", maxLength: 300 },
        hypoallergenic: { type: "boolean" },
        dietary: { type: "array", items: { type: "string" }, uniqueItems: true },
        breed: { type: "string", maxLength: 30 }
    },
    additionalProperties: false
}


module.exports = {
  newPetSchema, signUpSchema, loginSchema, updateSchema, updatePetSchema
  }
