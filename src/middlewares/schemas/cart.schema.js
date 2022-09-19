import joi from "joi";

export const cartSchema = joi.object({
  idProduct: joi.string().required(),
  size: joi.string().required(),
  color: joi.string().required(),
  quantity: joi.number().integer().required(),
});