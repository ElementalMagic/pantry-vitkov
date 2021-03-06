var express = require('express');
var router = express.Router();
var Item = require('../models/ProductItem');
var ProdTypeModel = require('../models/ProductType');
const upload = require('../middleware/upload');

const passport = require('passport');


router.get('/id/:id', async function (req, res) {
    try {
        const item = await Item.findOne({_id: req.params.id});
        res.status(200).json(item);
    } catch (e) {
        console.log(e.message);
        res.status(500).json("Товар не найден.")
    }
});

router.get('/type', async function (req, res) {
    try {
        const items = await Item
            .find({prodType: req.query.prodType})
            .sort({date: -1})
            .skip(req.query.offset ? +req.query.offset : 0)
            .limit(req.query.limit ? +req.query.limit : 0);
        res.status(200).json(items);
    } catch (e) {
        console.log(e);
    }
});
router.patch('/type/:id', passport.authenticate('jwt', {session: false}), async function (req, res) {
    try {
        const type = await ProdTypeModel.findOneAndUpdate({_id: req.params.id}, {multiName: req.body.multiName});
        res.status(200).json(type);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/type/:id', passport.authenticate('jwt', {session: false}), async function (req, res) {
    try {
        await ProdTypeModel.deleteOne({_id: req.params.id});
        res.status(200).json({message: "Тип удален"});
    } catch (e) {
        console.log(e);
    }
});

router.get('/types', async function (req, res) {
    try {
        let items;
        if (Object.keys(req.query).length === 0) {
            items = await ProdTypeModel.find()
            /*.skip(req.query.offset ? +req.query.offset : 0 )
            .limit(req.query.limit ? +req.query.limit : 0);*/
        } else {
            items = await ProdTypeModel.findOne({name: req.query.prodType});
        }
        res.status(200).json(items);
    } catch (e) {
        console.log(e);
    }
});

router.get('/', async function (req, res) {
    try {

        let items;
        try {
            items = await Item
                .find()
                .sort({date: -1})
                .skip(req.query.offset ? +req.query.offset : 0)
                .limit(req.query.limit ? +req.query.limit : 0);
        } catch (e) {
            console.log(e);
        }
        res.status(200).json(items);
    } catch (e) {
        console.log(e.message);
        res.status(500).json("Товары не найдены.");
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), async function (req, res) {
    try {
        const rightPath = req.file.path;
        const path = rightPath.replace('images\\', 'images/');
        const candidate = new Item({
            title: req.body.title,
            prodType: req.body.prodType,
            collectionId: req.body.collectionId,
            vendorCode: req.body.vendorCode,
            barcode: req.body.barcode,
            weight: req.body.weight,
            equipment: req.body.equipment,
            specs: req.body.specs,
            cost: req.body.cost,
            marketUrl: req.body.marketUrl,
            imgSrc: req.file ? path : ''
        });
        await candidate.save();
        let typeCandidate = await ProdTypeModel.findOne({name: req.body.prodType.toString().toLowerCase()});

        if (typeCandidate) {
            typeCandidate.products.push({'id': candidate._id});
        } else {
            console.log(req.body);
            typeCandidate = new ProdTypeModel({

                name: req.body.prodType.toLowerCase(),
                products: [{id: candidate._id}]
            });
        }

        typeCandidate.save();
        res.status(200).json(candidate);
    } catch (e) {
        console.log(e);
    }
});

router.post('/fixtypes', passport.authenticate('jwt', {session: false}), async function (req, res) {
    try {
        let types = await ProdTypeModel.find();

        for (let i = 0; i < types.length; i++) {
            for (let j = 0; j < types[i].products.length; j++) {
                let candidate = await Item.findOne({_id: types[i].products[j].id});

                if (!candidate || candidate.length === 0 || Object.keys(candidate).length === 0 || candidate.prodType.toLowerCase() !== types[i].name.toLowerCase()) {
                    types[i].products.splice(j, 1);
                } else if (candidate.prodType.toLowerCase() !== types[i].name.toLowerCase()) {
                    types[i].products.splice(j, 1);
                }
            }

            if (types[i].products.length < 1) {
                await ProdTypeModel.deleteOne({_id: types[i]._id});
            } else {
                await ProdTypeModel.findOneAndUpdate({_id: types[i]._id}, types[i]);
            }
        }
        res.status(200).json({message: "Типа исправлены"});
    } catch (e) {
        console.log(e);
    }
});
router.delete('/:id', passport.authenticate('jwt', {session: false}), async function (req, res) {
    try {
        const item = await Item.findOne({_id: req.params.id});
        await Item.remove({_id: req.params.id});
        const pt = await ProdTypeModel.findOne({name: item.prodType.toLowerCase()});
        console.log(pt);
        const index = pt.products.findIndex(p => {
            return p.id === item._id
        });
        if (index) {
            pt.products.splice(index, 1);
        }
        await pt.save();

        res.status(200).json({message: "Товар успешно удален"});
    } catch (e) {
    }
});

router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), async function (req, res) {
    try {
        console.log(req.body);
        const updated = {
            title: req.body.title,
            prodType: req.body.prodType,
            collectionId: req.body.collectionId,
            vendorCode: req.body.vendorCode,
            barcode: req.body.barcode,
            weight: req.body.weight,
            equipment: req.body.equipment,
            specs: req.body.specs,
            marketUrl: req.body.marketUrl,
            cost: req.body.cost,
        };

        if (req.file) {
            updated.imgSrc = req.file.path
        }
        ;
        const item = await Item.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true});

        let typeCandidate = await ProdTypeModel.findOne({name: req.body.prodType.toString().toLowerCase()});

        if (typeCandidate) {
            let index = typeCandidate.products.findIndex(p => {
                return p.id === req.params.id;
            });
            if (index === (-1)) {
                typeCandidate.products.push({'id': req.params.id});
            }
        } else {
            typeCandidate = new ProdTypeModel({
                name: req.body.prodType.toLowerCase(),
                products: [{id: req.params.id}]
            });
        }

        typeCandidate.save();
        res.status(200).json(item);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
