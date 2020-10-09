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
    UserModel,
    UserProfilesModel,
    CreateVcForConfirmModel,
    GetUserDataLoginModel,
    GetEmailSignupModel,
    CreateVcForForgetPassModel
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

        const checkEmail = await GetEmailSignupModel(req.body.email);
        if (checkEmail[1].length > 0) {
            throw new Error("Email is exists, try other email");
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
            verify_code: hashUsername,
            vc_for: 1
        }
        const resultUserVC = await CreateVcForConfirmModel(dataUserVC);

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
            html: `<p>Klik this <a href="${process.env.APP_ENV === "development" ? 'http://localhost:6000' : 'https://balobe.herokuapp.com'}/auth/confirmAccount?id_user=${id_user}&verify_code=${encodeURI(hashUsername)}">link</a> for confirm</p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log('Email sent: ' + info.response);
        });
        //email last line code

        res.status(201).send({
            msg: "Your account is succesfully registered"
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

exports.ConfirmAccountController = async (req, res) => {
    try {
        if (!req.query.id_user || !req.query.verify_code) {
            throw new Error("your link is not valid")
        }

        //cehck id_user is empty or not
        const id_user = await GetIdUserModel(req.query.id_user);
        if (id_user[1].length > 0) {

            // check verify code is not empty and vc_for = 1
            const verifyCode = await GetVerifyCodeAccountModel(req.query.verify_code);
            if (verifyCode[1].length > 0) {

                let createdDate = Date.parse(verifyCode[1][0].created_at);
                let today = new Date();

                const limitDateConfirm = 172800000; // two day in int

                // check link is expired or not
                if ((today.getTime() - createdDate) < limitDateConfirm) {
                    const result1 = await FinishConfirmAccountModel(req.query.id_user);
                    res.status(200).send({
                        data: {
                            msg: "your account is confirm"
                        }
                    });
                } else {
                    const result2 = await ExpiredLinkConfirmAccoutModel(req.query.id_user);
                    throw new Error("your link is expired");
                }
            } else {
                throw new Error("your verify code is invalid");
            }
        } else {
            throw new Error("your account is not defined");
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
            throw new Error("your account is not defined");
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

exports.ForgotPassController = async (req, res) => {
    try {
        if (!req.body.email) {
            throw new Error("email is required")
        }

        const checkEmail = await GetEmailSignupModel(req.body.email);
        if (checkEmail[1].length > 0) {
            if (checkEmail[1][0].status === 1) {
                
                const hashEmail = bcrypt.hashSync(checkEmail[1][0].email);
                const dataUserVC = {
                    id_user: checkEmail[1][0].id_user,
                    verify_code: hashEmail,
                    vc_for: 2
                }
                const result = await CreateVcForForgetPassModel(dataUserVC);

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

                const id_user = checkEmail[1][0].id_user;
                const mailOptions = {
                    from: userGmail,
                    to: req.body.email,
                    subject: 'Change Password',
                    html: `<p>Klik this <a href="${process.env.APP_ENV === 'development' ? 'http://localhost:6000' : 'https://balobe.herokuapp.com'}/auth/confirmPass?id_user=${id_user}&verify_code=${encodeURI(hashEmail)}">link</a> for change your password</p>`
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) throw err;
                    console.log('Email sent: ' + info.response);
                });
                //email last line code

                res.status(200).send({
                    data: {
                        msg: "please check your email for link change password"
                    }
                });
            } else {
                throw new Error("Your account is not activate");
            }
        } else {
            throw new Error("Your email is not exists in database");
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

exports.ConfirmPassController = async (req, res) => {
    try {
        if (!req.query.id_user || !req.query.verify_code) {
            throw new Error("your link is invalid")
        }

        const result = await GetIdUserModel(req.query.id_user);
        if (result[1].length > 0) {

            const verifyCode = await GetVerifyCodePassModel(req.query.verify_code);

            if (verifyCode[1].length > 0) {

                let createdDate = Date.parse(verifyCode[1][0].created_at);
                let today = new Date();

                const limitDateConfirm = 172800000; // two day in int

                // check link is expired or not
                if ((today.getTime() - createdDate) < limitDateConfirm) {
                    res.status(200).send({
                        data: {
                            link: `${process.env.APP_ENV === 'development' ? 'http://localhost:6000' : 'https://balobe.herokuapp.com'}/auth/updatePass/${req.query.id_user}`
                        }
                    });
                } else {
                    const delExpiredPassLink = await ExpiredLinkUpdatePassModel(req.query.id_user);
                    throw new Error("your link is expired");
                }
            } else {
                throw new Error("your verify code is invalid");
            }
        } else {
            throw new Error("your account is defined");
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

exports.ChangePasswordController = async (req, res) => {
    try {

        if (!req.body.password) {
            throw new Error("please input your new password")
        }

        const hashPassword = bcrypt.hashSync(req.body.password);
        const result = await ChangePasswordModel(req.params.id, hashPassword);
        res.status(200).send({
            data: {
                msg: "You password is updated"
            }
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