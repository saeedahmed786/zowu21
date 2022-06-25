const User = require('../Models/userModel');
var fs = require('fs');
var bcrypt = require('bcryptjs');
const config = require('../config/keys');
const jwt = require('jsonwebtoken');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinaryConfig');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(config.googleClient);
const fetch = require('node-fetch')

exports.getAllUsers = async (req, res) => {
    const users = await User.find().sort({ updatedAt: -1 });
    if (users) {
        res.status(200).json(users);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.signUp = async (req, res) => {
    const ifEmailAlreadyPresent = await User.findOne({ email: req.body.email });
    const ifUsernameAlreadyPresent = await User.findOne({ username: req.body.username });
    if (ifEmailAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Email already exists. Please try another one.' });
    }
    else if (ifUsernameAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Username already exists. Please try another one.' });
    }
    else {
        const { path } = req.file;
        const uploading = await cloudinary.uploads(path, 'Zowu/User');
        fs.unlinkSync(path);

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            username: req.body.username,
            image: uploading,
            password: hash
        });

        const saveUser = await user.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'Account created successfuly!. Please Sign in.' });
        } else {
            res.status(400).json({ errorMessage: 'Account not created. Please try again' });
        }
    }
}


exports.login = async (req, res) => {
    const findUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.email }]
    });

    if (findUser) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id,
                    role: findUser.role
                }
            }
            jwt.sign(payload, config.jwtSecret, (err, token) => {
                if (err) res.status(400).json({ errorMessage: 'Jwt Error' })

                const { _id, fullName, role, username, email, image } = findUser;
                res.status(200).json({
                    _id,
                    role,
                    fullName,
                    username,
                    email,
                    image,
                    token,
                    successMessage: 'Logged In Successfully',

                });
            });
        } else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }

    } else {
        res.status(201).json({ errorMessage: 'Incorrect username or password.' })
    }
}


exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;
    googleClient?.verifyIdToken({ idToken, audience: config.googleClient })
        .then(response => {
            console.log(response.payload);
            const { email_verified, name, email, picture } = response.payload;
            console.log(email);
            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const payload = {
                            user: {
                                _id: user._id,
                                role: user.role,
                                email: user.email
                            }
                        }
                        const token = jwt.sign(payload, config.jwtSecret, {
                            expiresIn: '7d'
                        });
                        const { _id, email, role, fullName, image } = user;
                        return res.json({
                            _id,
                            role,
                            fullName,
                            email,
                            image,
                            token,
                            successMessage: 'Logged In Successfully',
                        });
                    } else {
                        let password = email + config.jwtSecret;
                        let user = new User({ fullName: name, email, password, username: email, image: { url: picture } });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with google'
                                });
                            }
                            const payload = {
                                user: {
                                    _id: data._id,
                                    role: data.role,
                                    email: data.email
                                }
                            }
                            const token = jwt.sign(
                                payload,
                                config.jwtSecret
                            );
                            const { _id, email, fullName, username, image, role } = data;
                            return res.json({
                                token,
                                _id, email, fullName, username, image, role
                            });
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again'
                });
            }
        });
}


exports.facebookLogin = async (req, res) => {
    const { userID, accessToken } = req.body;
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                const { email, name, picture } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, {
                            expiresIn: '7d'
                        });
                        const { _id, fullName, role, username, email, image } = user;
                        return res.json({
                            _id,
                            role,
                            fullName,
                            username,
                            email,
                            image,
                            token,
                            successMessage: 'Logged In Successfully',
                        });
                    } else {
                        let password = email + config.jwtSecret;
                        user = new User({ fullName: name, email, password, username: email, image: { url: picture?.data?.url } });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id, role: data.role },
                                config.jwtSecret
                            );
                            const { _id, email, fullName, role, image, username } = data;
                            return res.json({
                                _id,
                                role,
                                fullName,
                                username,
                                email,
                                image,
                                token,
                                successMessage: 'Logged In Successfully',
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
}

exports.updateUserProfile = async (req, res) => {
    const findUser = await User.findOne({ _id: req.params.id });
    if (findUser) {
        if (req.file) {
            const imgUrl = findUser.picture?.cloudinary_id;
            imgUrl && await cloudinaryCon.uploader.destroy(imgUrl);
            const { path } = req.file;
            const uploading = await cloudinary.uploads(path, 'Zowu/User');
            fs.unlinkSync(path);
            findUser.fullName = req.body.fullName;
            findUser.username = req.body.username;
            findUser.description = req.body.description;
            findUser.image = uploading;

            const saveUser = await findUser.save();
            if (saveUser) {
                res.status(200).json({ successMessage: 'User Updated Successfully' })
            } else (
                res.status(400).json({ errorMessage: 'User could not be Updated.' })
            )
        }
        else {
            findUser.fullName = req.body.fullName;
            findUser.username = req.body.username;
            findUser.description = req.body.description;

            const saveUser = await findUser.save();
            if (saveUser) {
                res.status(200).json({ successMessage: 'User Updated Successfully' })
            } else (
                res.status(400).json({ errorMessage: 'User could not be Updated.' })
            )
        }
    } else {
        res.status(404).json({ errorMessage: 'User not found.' })
    }
}