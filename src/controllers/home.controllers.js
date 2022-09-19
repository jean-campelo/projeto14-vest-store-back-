import db from "../database/db.js";
import joi from "joi";

// função provisória pra add produtos no bd //

async function getIdProduct() {
    const lastId = await db.collection('products')
        .find().sort({ idProduct: -1 }).limit(1).toArray();
    if (lastId.length === 0) return 1001;
    return lastId[0].idProduct + 1;
}

async function getIdSelection() {
    const lastId = await db.collection('selections')
        .find().sort({ idSelection: -1 }).limit(1).toArray();
    if (lastId.length === 0) return 101;
    return lastId[0].idSelection + 1;
}

const ProductSchema = joi.object({
    idProduct: joi.number().integer().greater(1000).required(),
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

const SelectionSchema = joi.object({
    idSelection: joi.number().integer().greater(100).required(),
    title: joi.string().required(),
    img: joi.string().required(),
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

export async function addSelection(req, res) {
    try {

        const id = await getIdSelection();
        const validation = SelectionSchema.validate({ ...req.body, idSelection: id }, {
            abortEarly: false,
        });

        if (validation.error) {
            const errors = validation.error.details.map(
                (detail) => detail.message
            );
            return res.status(422).send({ message: errors });
        }

        await db.collection('selections')
            .insertOne({
                idSelection: validation.value.idSelection,
                title: validation.value.title,
                img: validation.value.img,
            });

        res.sendStatus(201);
        return;

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function addProductToSelection(req, res) {
    try {

        const randomProducts = await db.collection('products')
            .aggregate([{ $sample: { size: 2 } }]).toArray();

        const randomProductsIds = []
        randomProducts.forEach(product => {
            randomProductsIds.push(product._id);
        })

        const selectionId = await db.collection('selections')
            .findOne({ idSelection: req.body.idSelection });

        await db.collection('selection_items')
            .insertMany([{
                idSelection: selectionId._id,
                idProduct: randomProductsIds[0]
            }, {
                idSelection: selectionId._id,
                idProduct: randomProductsIds[1]
            }]);

        res.sendStatus(201);
        return;

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function returnProducts(req, res) {

    try {
        //products
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

        // selections
        const selections = await db
            .collection('selections').find().toArray();

        const selectionsSend = selections.map(product => {
            delete product._id;
            return product;
        })

        res.send({ selections: selectionsSend, products: productsSend });
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

export async function returnSelection(req, res) {
    const idSelection = req.params.id;

    try {
        const selection = await db
            .collection('selections').findOne({
                idSelection: parseInt(idSelection)
            });
        if (!selection) return res.status(404).send('Seleção não encontrada')

        const linkProducts = await db.collection('selection_items')
            .find({
                idSelection: selection._id
            }).toArray();

        let productsSend = [];

        if (linkProducts.length > 0) {
            const idsProducts = [];
            linkProducts.forEach(product => {
                idsProducts.push(product.idProduct);
            })

            const products = await db.collection('products')
                .find({ _id: { $in: idsProducts } }).toArray();

            productsSend = products.map(product => {
                delete product._id;
                delete product.sizesOption;
                delete product.storage;
                delete product.color;
                delete product.type;
                return product;
            })
        }

        res.send({ selectionTitle: selection.title, products: productsSend });
    } catch (error) {
        return res.status(500).send(error);
    }
}