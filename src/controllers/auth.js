const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require('dotenv').config();

const {
    GetUsernameSignupModel,
    GetIdUserModel,
    GetVerifyCodeAccountModel,
    GetVerifyCodePassModel,
    FinishConfirmAccountModel,
    ExpiredLinkConfirmAccoutModel,
    ExpiredLinkUpdatePassModel,
    ChangePasswordModel,
    CreateUserModel,
    CreateUserProfilesModel,
    CreateTokenForConfirmModel,
    GetUserDataSigninModel,
    GetEmailSignupModel,
    CreateTokenForForgetPassModel
} = require("../models/auth");

exports.SignupController = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password || !req.body.fullname || !req.body.gender || !req.body.address || !req.body.phone) {
            throw new Error("Your data form can't be empty");
        }

        const checkUsername = await GetUsernameSignupModel(req.body.username);
        if (checkUsername[1].length > 0) {
            res.status(404).send({
                error: {
                    msg: "Username is found, try other username"
                },
            });
        }

        const dataEmail = await GetEmailSignupModel(req.body.email);
        if (dataEmail[1].length > 0) {
            res.status(404).send({
                error: {
                    msg: "Email is found, try other email"
                },
            });
        }

        const hashPassword = bcrypt.hashSync(req.body.password);
        const dataUser = {
            username: req.body.username,
            password: hashPassword,
            status: 0,
            role_id: req.body.role_id,
        }
        const resultUser = await CreateUserModel(dataUser);

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
        await CreateUserProfilesModel(dataUserProfiles);

        const hashUsername = bcrypt.hashSync(req.body.username);
        const dataUserVC = {
            id_user: resultUser[1].insertId,
            verify_code: hashUsername,
            vc_for: 1
        }
        await CreateTokenForConfirmModel(dataUserVC);

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

        const urlApp = 'http://localhost:3000'; // -> etc (https://balobe.herokuapp.com or domain google(for react ap))
        const id_user = resultUser[1].insertId;
        const mailOptions = {
            from: userGmail,
            to: dataUserProfiles.email,
            subject: 'Confirm Account',
            html: `<p>Click this <a href="${process.env.APP_ENV === "development" ? 'http://localhost:5000' : urlApp}/auth/confirmAccount?id_user=${id_user}&verify_code=${encodeURI(hashUsername)}">link</a> for confirm</p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log('Email sent: ' + info.response);
        });

        //email last line code
        
        res.status(201).send({
            data: {
                msg: "Please check your email inbox for confirm"
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "Something wrong!"
            },
        });
    }
}

exports.ConfirmAccountController = async (req, res) => {
    try {
        if (!req.query.id_user || !req.query.verify_code) {
            throw new Error("Your link is not valid")
        }

        //cehck id_user is empty or not
        const user = await GetIdUserModel(req.query.id_user);
        if (user[1].length > 0) {

            // check verify code is not empty and vc_for = 1
            const verifyCode = await GetVerifyCodeAccountModel(req.query.verify_code);
            if (verifyCode[1].length > 0) {

                let createdDate = Date.parse(verifyCode[1][0].created_at);
                let today = new Date();

                const limitDateConfirm = 172800000; // two day in int

                // check link is expired or not
                if ((today.getTime() - createdDate) < limitDateConfirm) {
                    await FinishConfirmAccountModel(req.query.id_user);
                    res.status(200).send({
                        data: {
                            msg: "Your account is confirm"
                        }
                    });
                } else {
                    await ExpiredLinkConfirmAccoutModel(req.query.id_user);
                    res.status(404).send({
                        error: {
                            msg: "Your link is expired"
                        },
                    });
                }
            } else {
                res.status(404).send({
                    error: {
                        msg: "Your verify code is invalid"
                    },
                });
            }
        } else {
            res.status(404).send({
                error: {
                    msg: "Your account is not defined"
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "Something wrong!"
            },
        });
    }
}

exports.SigninController = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            throw new Error("Username and password is required")
        }
        const result = await GetUserDataSigninModel(req.body.username);

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
                    res.status(201).send({
                        data: {
                            accesToken: token,
                            msg: "Welcome! " + dataUser.username
                        }
                    });
                } else {
                    res.status(404).send({
                        error: {
                            msg: "Username or password is not valid"
                        }
                    });
                }
            } else {
                res.status(404).send({
                    error: {
                        msg: "Your account is not activate"
                    }
                });
            }
        } else {
            res.status(404).send({
                error: {
                    msg: "Your account is not defined"
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "Something wrong!"
            },
        });
    }
}

exports.ForgotPassController = async (req, res) => {
    try {
        if (!req.body.email) {
            throw new Error("Email is required")
        }

        const dataEmail = await GetEmailSignupModel(req.body.email);
        if (dataEmail[1].length > 0) {
            if (dataEmail[1][0].status === 1) {
                
                const hashEmail = bcrypt.hashSync(dataEmail[1][0].email);
                const dataUserVC = {
                    id_user: dataEmail[1][0].id_user,
                    verify_code: hashEmail,
                    vc_for: 2
                }
                await CreateTokenForForgetPassModel(dataUserVC);

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
                const urlApp = 'http://localhost:3000'; // -> etc (https://balobe.herokuapp.com or domain google(for react ap))
                const idUser = dataEmail[1][0].id_user;
                const mailOptions = {
                    from: userGmail,
                    to: req.body.email,
                    subject: 'Change Password',
                    html: `<p>Click this <a href="${process.env.APP_ENV === 'development' ? 'http://localhost:5000' : urlApp}/auth/confirmPass?id_user=${idUser}&verify_code=${encodeURI(hashEmail)}">link</a> for change your password</p>`
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) throw err;
                    console.log('Email sent: ' + info.response);
                });
                //email last line code

                res.status(201).send({
                    data: {
                        msg: "Please check your email for link change password"
                    }
                });
            } else {
                res.status(404).send({
                    error: {
                        msg: "Your account is not activate"
                    }
                });
            }
        } else {
            res.status(404).send({
                error: {
                    msg: "Your email is not found"
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "Something wrong!"
            },
        });
    }
}

exports.ConfirmPassController = async (req, res) => {
    try {
        if (!req.query.id_user || !req.query.verify_code) {
            throw new Error("Your link is invalid")
        }

        const dataUser = await GetIdUserModel(req.query.id_user);
        if (dataUser[1].length > 0) {

            const verifyCode = await GetVerifyCodePassModel(req.query.verify_code);
            if (verifyCode[1].length > 0) {

                let createdDate = Date.parse(verifyCode[1][0].created_at);
                let today = new Date();

                const limitDateConfirm = 172800000; // two day in int

                // check link is expired or not
                if ((today.getTime() - createdDate) < limitDateConfirm) {
                    const urlApp = 'http://localhost:3000'; // -> etc (https://balobe.herokuapp.com or domain google(for react ap))
                    res.status(200).send({
                        data: {
                            link: `${process.env.APP_ENV === 'development' ? 'http://localhost:5000' : urlApp}/auth/updatePass/${req.query.id_user}`
                        }
                    });
                } else {
                    await ExpiredLinkUpdatePassModel(req.query.id_user);
                    res.status(404).send({
                        error: {
                            msg: "Your link is expired"
                        }
                    });
                }
            } else {
                res.status(404).send({
                    error: {
                        msg: "Your verify code is invalid"
                    }
                });
            }
        } else {
            res.status(404).send({
                error: {
                    msg: "Your account is not defined"
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "Something wrong!"
            },
        });
    }
}

exports.ChangePasswordController = async (req, res) => {
    try {

        if (!req.body.password) {
            throw new Error("Please input your new password")
        }

        const hashPassword = bcrypt.hashSync(req.body.password);
        await ChangePasswordModel(req.params.id, hashPassword);
        res.status(200).send({
            data: {
                msg: "Your password is updated"
            }
        });

    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
}