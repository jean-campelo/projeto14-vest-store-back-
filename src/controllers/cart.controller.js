import db from "../database/db.js";
import { ObjectId } from "mongodb";

export async function getCartItems(req, res) {
  const { userId } = req.locals.session;

  try {
    const userCart = await db.collection("carts").findOne({ userId });
    const products = userCart
      ? await db
          .collection("products")
          .find({
            _id: {
              $in: userCart.products.map(
                (product) => ObjectId(product.productId)
              ),
            },
          })
          .toArray()
      : [];

    const responseData = products.map((product) => ({
      ...product,
      quantity: userCart.products.find(
        (p) => p.productId === product._id.toString()
      ).quantity,
    }));

    return res.status(200).send(responseData);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function addProductToCart(req, res) {
  const { userId } = req.locals.session;
  const { idProduct, quantity } = req.body;

  const validationCart = cartSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationCart.error) {
    const errors = validationCart.error.details.map((detail) => detail.message);
    return res.status(422).send({ message: errors });
  }

  try {
    const userCart = await db.collection("carts").findOne({ userId });

    if (userCart) {
      const productAlreadyInCart = userCart.products.find(
        (product) => product.productId === idProduct
      );

      if (productAlreadyInCart) {
        await db.collection("carts").updateOne(
          { userId },
          {
            $set: {
              products: userCart.products.map((product) =>
                product.productId === idProduct
                  ? { idProduct, quantity, size, color }
                  : product
              ),
            },
          }
        );
      } else {
        await db.collection("carts").updateOne(
          { userId },
          {
            $push: {
              products: { idProduct, quantity, size, color },
            },
          }
        );
      }
    } else {
      await db.collection("carts").insertOne({
        userId,
        products: [{ idProduct, quantity }],
      });
    }

    return res.status(201).send({ message: "Product added to cart" });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function removeProductFromCart(req, res) {
  const { userId } = req.locals.session;
  const { idProduct } = req.body;

  try {
    const userCart = await db.collection("carts").findOne({ userId });

    if (userCart) {
      await db.collection("carts").updateOne(
        { userId },
        {
          $pull: {
            products: { idProduct },
          },
        }
      );
    }

    return res.status(200).send({ message: "Product removed from cart" });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function updateProductQuantity(req, res) {
  const { userId } = req.locals.session;
  const { idProduct, quantity } = req.body;

  const validationCart = cartSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationCart.error) {
    const errors = validationCart.error.details.map((detail) => detail.message);
    return res.status(422).send({ message: errors });
  }

  try {
    const userCart = await db.collection("carts").findOne({ userId });

    if (userCart) {
      await db.collection("carts").updateOne(
        { userId },
        {
          $set: {
            products: userCart.products.map((product) =>
              product.idProduct === idProduct
                ? { idProduct, quantity, size, color }
                : product
            ),
          },
        }
      );
    }

    return res.send(200).send({ message: "Product quantity updated" });
  } catch (error) {
    return res.sendStatus(500);
  }
}
