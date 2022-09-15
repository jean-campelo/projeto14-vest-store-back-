import db from "../database/db.js";

async function registerNewUser(req, res) {
  const { name, color } = req.body;

  await db.collection("products").insertOne({
    name,
    color,
  });
  console.log({ name });

  res.send(201);
};

async function getUsers (req, res) {

  try {
    const viewInsertion = await db
      .collection("products")
      .find({ color: "blue" })
      .toArray();
    res.send(viewInsertion);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
}

export { registerNewUser, getUsers };
