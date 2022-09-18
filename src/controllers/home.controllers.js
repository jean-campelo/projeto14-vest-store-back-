import db from "../database/db.js";
import joi from "joi";

// função provisória pra add produtos no bd //

async function getIdProduct() {
    const lastId = await db.collection('products')
        .find().sort({ idProduct: -1 }).limit(1).toArray();
    if (lastId.length === 0) return 1001;
    return lastId[0].idProduct + 1;
}

const ProductSchema = joi.object({
    idProduct: joi.number().integer().required(),
    name: joi.string().required(),
    img: joi.string().required(),
    sizesOption: joi.array().items(
        joi.string().valid('PP', 'P', 'M', 'G', 'GG'),
        joi.number()).required(),
    storage: joi.number().integer().greater(-1).required(),
    color: joi.string().required(),
    price: joi.number().required(),
    type: joi.string().valid('tshirt', 'pants', 'shoes', 'accessory').required(),
});

export async function addProduct(req, res) {
    try {

        const id = await getIdProduct();
        const validation = ProductSchema.validate({ ...req.body, idProduct: id }, {
            abortEarly: false,
        });

        if (validation.error) {
            const errors = validation.error.details.map(
                (detail) => detail.message
            );
            return res.status(422).send({ message: errors });
        }

        await db.collection('products')
            .insertOne({
                idProduct: validation.value.idProduct,
                name: validation.value.name,
                img: validation.value.img,
                sizesOption: validation.value.sizesOption,
                storage: validation.value.storage,
                color: validation.value.color,
                price: validation.value.price,
                type: validation.value.type,
            });

        res.sendStatus(201);
        return;

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function returnProducts(req, res) {

    try {
        const products = await db
            .collection('products').find().toArray();

        const productsSend = products.map(product => {
            delete product._id;
            delete product.sizesOption;
            delete product.storage;
            delete product.color;
            delete product.type;
            return product;
        })

        res.send({ products: productsSend });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function returnCategory(req, res) {
    const category = req.params.category;
    if (category === 'not-found') {
        res.send({ selectionTitle: 'categoria não encontrada' });
        return;
    }

    try {
        const products = await db
            .collection('products').find({
                type: category
            }).toArray();

        const productsSend = products.map(product => {
            delete product._id;
            delete product.sizesOption;
            delete product.storage;
            delete product.color;
            delete product.type;
            return product;
        })

        res.send({ products: productsSend });
    } catch (error) {
        return res.status(500).send(error);
    }
}