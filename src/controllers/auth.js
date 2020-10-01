const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require('dotenv').config();

const {
    GetUsernameSignupModel,
    GetIdUserModel,
    GetVerifyCodeModel,
    FinishConfirm,
    UserModel,
    UserProfilesModel,
    UserVC,
    GetUserDataLoginModel
} = require("../models/auth");

exports.SignupController = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password || !req.body.fullname || !req.body.address || !req.body.phone) {
            throw new Error("Your data form can't be empty")
        }

        const checkUsername = await GetUsernameSignupModel(req.body.username);
        if (checkUsername[1].length > 0) {
            throw new Error("Username is exists, try other username");
        }

        const hashPassword = bcrypt.hashSync(req.body.password);
        const dataUser = {
            username: req.body.username,
            password: hashPassword,
            status: 0,
            role_id: req.body.role_id,
        }
        const resultUser = await UserModel(dataUser);

        const dataUserProfiles = {
            id_user: resultUser[1].insertId,
            fullname: req.body.fullname,
            gender: req.body.gender,
            picture: "uploads/img-users/default.JPG",
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            balance: req.body.balance
        }
        const resultUserProfiles = await UserProfilesModel(dataUserProfiles);

        const hashUsername = bcrypt.hashSync(req.body.username);
        const dataUserVC = {
            id_user: resultUser[1].insertId,
            verify_code: hashUsername
        }
        const resultUserVC = await UserVC(dataUserVC);

        //email firts line code
        const userGmail = 'desa.oelatimo@gmail.com';
        const passGmail = 'Oelatimo123';

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: userGmail,
                pass: passGmail
            }
        });

        const id_user = resultUser[1].insertId;
        const mailOptions = {
            from: userGmail,
            to: dataUserProfiles.email,
            subject: 'Confirm Account',
            html: '<p>Klik this <a href="https://balobe.herokuapp.com/auth/confirm?id_user=' + id_user + '&verify_code=' + encodeURI(hashUsername) + '">link</a> for confirm</p>'
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log('Email sent: ' + info.response);
        });
        //email last line code

        res.status(201).send({
            msg: "Your akun is succesfully registered"
        });
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
}

exports.ConfirmController = async (req, res) => {
    try {

        if (!req.query.id_user || !req.query.verify_code) {
            throw new Error("your link is not valid")
        }

        const id_user = await GetIdUserModel(req.query.id_user);
        if (id_user[1].length > 0) {

            const verifyCode = await GetVerifyCodeModel(req.query.verify_code);
            if (verifyCode[1].length > 0) {

                const result1 = await FinishConfirm(req.query.id_user);
                console.log(result1);
                res.status(200).send({
                    data: {
                        msg: "confirm is successfully"
                    }
                });

            } else {
                throw new Error("your verify code is invalid");
            }
        } else {
            throw new Error("your username is invalid");
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
}

exports.LoginController = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            throw new Error("username and password is required")
        }
        const result = await GetUserDataLoginModel(req.body.username);

        if (result[1].length > 0) {
            const dataUser = result[1][0];

            if (dataUser.status === 1) {

                if (bcrypt.compareSync(req.body.password, dataUser.password)) {
                    const token = jwt.sign({
                            id_user: dataUser.id_user,
                            username: dataUser.username,
                            role_id: dataUser.role_id
                        },
                        `${process.env.JWT_TOKEN}`, {
                            expiresIn: "1D"
                        }
                    );
                    res.status(200).send({
                        data: {
                            accesToken: token,
                            msg: "Login success, welcome! " + dataUser.username
                        }
                    });
                } else {
                    throw new Error("username or password is wrong");
                }
            } else {
                throw new Error("your account is not activate");
            }
        } else {
            throw new Error("your akun is not defined");
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
}