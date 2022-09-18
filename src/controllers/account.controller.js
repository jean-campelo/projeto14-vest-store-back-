import db from "../database/db.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const newUserSchema = joi.object({
  name: joi.string().required().empty(" "),
  email: joi.string().required().email(),
  password: joi.string().required(),
  imageProfile: joi.string().required(),
});

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().empty(" "),
});

async function registerNewUser(req, res) {
  const { name, email, password, imageProfile } = req.body;

  const validationNewUser = newUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationNewUser.error) {
    const errors = validationNewUser.error.details.map(
      (detail) => detail.message
    );
    return res.status(422).send({ message: errors });
  }

  try {
    const userAlreadyRegistered = await db
      .collection("dataUsers")
      .findOne({ email });

    if (userAlreadyRegistered) {
      res.status(422).send({ message: "User already registered" });
    }
  } catch (error) {
    return res.sendStatus(500);
  }

  //register new user
  try {
    db.collection("dataUsers").insertOne({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      imageProfile,
    });
  } catch (error) {
    return res.status(500).send({ message: "Register failed" });
  }

  res.sendStatus(201);
}

async function accessAccount(req, res) {
  const { email, password } = req.body;

  const userValidation = userSchema.validate(req.body, { abortEarly: false });

  if (userValidation.error) {
    const errors = userValidation.error.details.map((detail) => detail.message);
    return res.status(422).send({ message: errors });
  }

  try {
    const userRegistered = await db.collection("dataUsers").findOne({ email });

    if (!userRegistered) {
      return res.send(401).send({ message: "Email or password incorrects" });
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      userRegistered.passwordHash
    );

    if (!passwordIsValid) {
      return res.send(401).send({ message: "Email or password incorrects" });
    }

    //new token for session
    const token = uuid();
    await db
      .collection("sessions")
      .insertOne({ userId: userRegistered._id, token });
    res.send({ name: userRegistered.name, token });
  } catch (error) {
    return res.sendStatus(500);
  }
  res.sendStatus(200);
}

export { registerNewUser, accessAccount };
