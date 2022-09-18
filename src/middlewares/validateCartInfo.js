import { cartSchema} from './schemas/cart.schema.js'

export async function validateCartInfo(req, res, next) {
  const validation = cartSchema.validate(req.body);
  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}
