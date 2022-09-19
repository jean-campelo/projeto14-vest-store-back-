import db from "../database/db";

export async function validateToken(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "").trim();
  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.sendStatus(401);

    const user = await db.collection("dataUsers").findOne({
      _id: session.userId,
    });
    if (!user) return res.sendStatus(401);

    delete user.password;
    res.locals.user = user;
  } catch (e) {
    return res.sendStatus(500);
  }

  next();
}
