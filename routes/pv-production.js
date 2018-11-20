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
router.patch('/type/:id', async function (req, res) {
    try {
        const type = await ProdTypeModel.findOneAndUpdate({_id: req.params.id}, {multiName: req.body.multiName});
        res.status(200).json(type);
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
        let typeCandidate = await ProdTypeModel.findOne({name: req.body.prodType.toLowerCase()});


        if (typeCandidate) {
            typeCandidate.products.push({'id': candidate._id});
        } else {
            typeCandidate = new ProdTypeModel({
                name: req.body.prodType.toLowerCase(),
                products: [{id: candidate._id}]
            });
        }

        typeCandidate.save();
        res.status(200).json(candidate);
    } catch (e) {
        console.log(e.message);
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async function (req, res) {
    try {
        const item = await Item.findOne({_id: req.params.id});
        await Item.remove({_id: req.params.id});
        const pt = await ProdTypeModel.findOne({name: item.prodType.toLowerCase()});
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
        res.status(200).json(item);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
