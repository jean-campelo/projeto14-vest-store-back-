import db from "../database/db.js";

const validationNewUser = joi.object({
  name: joi.required().string().empty(" "),
  email: joi.required().email(),
  password: joi.required().strinf(),
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
}

export { registerNewUser };
