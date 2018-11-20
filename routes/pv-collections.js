var express = require('express');
var router = express.Router();
var Collection = require('../models/Collection');
var Item = require('../models/ProductItem');
const upload = require('../middleware/upload');
const passport = require('passport');

router.get('/', async function (req,res) {
    try {
        collections = await Collection
            .find()
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit);

        res.status(200).json(collections);
    } catch (e) {
        console.log(e);
    }
});
router.get('/:id', async function (req, res) {
    try {
        const col = await Collection.findOne({_id: req.params.id});
        let items;
        try {
             items = await Item
                .find({collectionId: col._id})
                .sort({date: -1})
                .skip(+req.query.offset)
                .limit(+req.query.limit);
        } catch (e) {
            console.log(e);
        }

        const resObject = {
            collection: col,
            collectionItems: items
        };
        res.status(200).json(resObject);
    } catch (e) {
        console.log(e.message);
        res.status(500).json("Коллекция не найдена.");
    }
});

router.post('/',passport.authenticate('jwt', {session: false}), upload.single('image'), async function (req, res) {
    try {
        console.log(req.body);
        const candidate = new Collection({
            title: req.body.title,
            name: req.body.name
        });

        await candidate.save();
        res.status(200).json(candidate);
    } catch (e) {
        console.log(e.message);
        res.status(500).json('Не удалось создать коллекцию :((');
    }
});


router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), async function (req,res) {
    try {
        const updated = {
            title: req.body.title,
            name: req.body.name
        };

        const item = await Collection.findOneAndUpdate(
            {_id: req.params.id},
            { $set: updated},
            { new: true});

        res.status(200).json(item);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async function (req, res) {
    try{
        await Collection.remove({_id: req.params.id});
        res.status(200).json({message: "Коллекция успешно удален"});
    } catch(e) {

    }
});

module.exports = router;
