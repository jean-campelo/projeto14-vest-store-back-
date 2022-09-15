import db from "../database/db.js";
import joi from "joi";

const newUserSchema = joi.object({
  name: joi.string().required().empty(" "),
  email: joi.required().email().string(),
  password: joi.required().string(),
});

async function registerNewUser(req, res) {
  const { name, email, passord, imageProfile } = req.body;

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
}

export { registerNewUser };
