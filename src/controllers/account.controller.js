import db from "../database/db.js";

async function registerNewUser(req, res) {
  const { name, color } = req.body;

  await db.collection("vest-store").insertOne({
    name,
    color,
  });
  console.log({ name });

  res.send(201);
};

async function getUsers (req, res) {

  try {
    const viewCollection = await db
      .collection("dataUsers")
      .find()
      .toArray();
    res.send(viewCollection);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
}

export { registerNewUser, getUsers };
