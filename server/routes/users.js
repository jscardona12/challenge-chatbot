var express = require('express');
var router = express.Router();
let passwordHash = require('../utils/password-hash');
let User = require('../schemas/users');


/* Post user. */
router.post('/register', (req, res, next) => {
    let body = {
        username: req.body.username.toLocaleLowerCase(),
        password: req.body.password
    };
    if (body.username === '' || body.username === null) {
        res.status(404).json({
            error: true,
            message: "username was not send in the body"
        });
    } else if (body.password === '' || body.password === null) {
        res.status(404).json({
            error: true,
            message: "password was not send in the body"
        });
    } else {
        try {
            body.online = true;
            body.socketId = '';
            body.room = '';

            body.password = passwordHash.createHash(body.password);

            const result = new User(body).save((err, user) => {
                if (err) {
                    res.status(500).json({
                        error: true,
                        message: err
                    });
                }if (user === null || user === undefined) {
                    res.status(200).json({
                        error: false,
                        message: "User registration failed"
                    });
                } else {
                    res.status(200).json({
                        error: false,
                        userId: user._id,
                        message: 'user created succesfully'
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    }
});


router.post('/login', (req, res, next) => {
    let body = {
        username: req.body.username.toLocaleLowerCase(),
        password: req.body.password
    };
    if (body.username === '' || body.username === null) {
        res.status(404).json({
            error: true,
            message: "username was not send in the body"
        });
    } else if (body.password === '' || body.password === null) {
        res.status(404).json({
            error: true,
            message: "password was not send in the body"
        });
    } else {
        try {

            User.find({'username': body.username}, (err, user) => {
                if (err) {
                    res.status(500).json({
                        error: true,
                        message: err
                    });

                }
                else if (user === null || user === undefined || user.length === 0) {
                    res.status(404).json({
                        error: true,
                    });
                } else {
                    if(passwordHash.compareHash(body.password,user[0].password)){
                        let updateUser = user[0];
                        updateUser.online = true;

                        new User(updateUser).save();
                        res.status(200).json({
                            error: false,
                            userId: user[0]._id
                        });
                    }

                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    }
});


router.post('/usernameAvailable', (req, res, next) => {
    let body = {
        username: req.body.username.toLocaleLowerCase(),
    };

    try {
        User.find({'username': body.username}, (err, user) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: err
                });

            }
            else if (user.length === 0) {
                res.status(200).json({
                    error: false,
                });
            } else {
                res.status(200).json({
                    error: true,
                });
            }
        });

    } catch (error) {
        res.status(500).json(error);
    }

});

module.exports = router;
