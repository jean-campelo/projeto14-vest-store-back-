import db from "../database/db.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

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
  const { name, email, password } = req.body;

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
      return;
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
    });
  } catch (error) {
    return res.status(500).send({ message: "Register failed" });
  }

  res.sendStatus(201);
  return;
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
      return res.status(401).send({ message: "Email or password incorrects" });
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      userRegistered.passwordHash
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Email or password incorrects" });
    }

    //new token for session
    const token = uuidv4();
    const session = await db.collection('sessions').findOne({ userId: userRegistered._id })
    if (session) {
      await db
        .collection('sessions')
        .updateOne(
          { userId: userRegistered._id }, { $set: { token: token } }
        );
    } else {
      await db
        .collection("sessions")
        .insertOne({ userId: userRegistered._id, token });
    }

    res.send({ name: userRegistered.name, token });
    return;
  } catch (error) {
    return res.sendStatus(500);
  }
}

export { registerNewUser, accessAccount };
