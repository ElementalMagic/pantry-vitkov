var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys')

const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "123456";

router.post('/login', async function (req, res) {
    const candidate = {email: req.body.email};

    if (candidate.email === ADMIN_LOGIN) {
        // Проверка пароля, пользователь сущетсвует
        const passwordResult ='' ;
        if (req.body.password === ADMIN_PASSWORD) {
            // Генерация токена, пароли совпали
            const token = jwt.sign({
                email: ADMIN_LOGIN,
                userId: 'admin'
            }, keys.jwt, {expiresIn: 60*60*60*60});

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // Пароли не совпали
            res.status(401).json({
                message: "Пароли не совпадают. Попробуйте снова."
            })
        }
    } else {
        // Пользователя нет, ошибка
        res.status(404).json({
            message: "Пользователь с таким email не найден."
        });
    }
});

module.exports = router;
