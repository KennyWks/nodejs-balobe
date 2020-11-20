require('dotenv').config();
const firebaseAdmin = require("../config/firebase");
const fs = require("fs");
const {
    UpdateImageProfileUserModel,
    UpdateProfileUserModel,
    GetDataUserProfiles,
    GetAllUserModel
} = require("../models/user");

exports.UpdateImageProfileUserContoller = async (req, res) => {
    try {

        if (process.env.APP_ENV === 'development') {
            const resultGetData = await GetDataUserProfiles(req.auth.id_user);
            imageOld = resultGetData[1][0].picture;

            let webPath = req.file.path.replace(/\\/g, '/');

            if (imageOld !== 'uploads/img-users/default.JPG' && imageOld !== webPath) {
                let deleteImage = "./" + imageOld;
                fs.unlink(deleteImage, function (err) {
                    if (err && err.code == 'ENOENT') {
                        // file doens't exist
                        console.info("File doesn't exist, won't remove it.");
                    } else if (err) {
                        // other errors, e.g. maybe we don't have enough permission
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            }

            const resultUpdate = await UpdateImageProfileUserModel(webPath, req.auth.id_user);

            res.status(200).send({
                data: {
                    id_user: req.auth.id_user,
                    lokasiFile: webPath,
                    msg: "upload image is success"
                }
            });
        } else {
            const pathFile = `img-users/${req.auth.id_user}.${req.file.mimetype.split("/")[1]}`;
            const resultUpdate = await UpdateImageProfileUserModel(pathFile, req.auth.id_user);
            const bucket = firebaseAdmin.storage().bucket();
            const data = bucket.file(pathFile);
            await data.save(req.file.buffer);
            res.status(200).send({
                data: {
                    path: `https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${encodeURIComponent(pathFile)}?alt=media`,
                    msg: "upload image is success"
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "Something wrong"
            }
        })
    }
}

exports.UpdateProfileUserContoller = async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Please add data to update");
        }

        const dataUpdate = {};
        const fillAble = ['fullname', 'gender', 'address', 'email', 'phone'];
        fillAble.forEach((v) => {
            if (req.body[v]) {
                dataUpdate[v] = req.body[v];
            }
        });

        if (!Object.keys(dataUpdate).length > 0) {
            throw new Error("Please add data to update");
        }

        const result = await UpdateProfileUserModel(req.auth.id_user, dataUpdate);
        console.log(result);
        res.status(200).send({
            data: {
                id_user: req.auth.id_user,
                msg: "your data is updated"
            },
        });
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.GetUserController = async (req, res) => {
    try {
        const result = await GetDataUserProfiles(req.params.id);
        // console.log(req.params.id);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                msg: "id user not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.GetAllUserController = async (req, res) => {
    try {
        let params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
        }

        if (req.query.sort) {
            const sortingValue = req.query.sort.split(".");
            params.sort = {
                key: sortingValue[0],
                value: sortingValue[1] ? sortingValue[1].toUpperCase() : "ASC"
            };
        }


        if (req.query.q) {
            params.search = req.query.q
        }

        const result = await GetAllUserModel(params);
        console.log(result[1][0]);
        if (result) {
            const totalData = result[1][0].total
            const totalPages = Math.ceil(result[1][0].total / parseInt(params.limit));
            res.status(200).send({
                data: result[2],
                metadata: {
                    pagination: {
                        currentPage: params.page,
                        totalPage: totalPages,
                        nextPage: parseInt(params.page) < totalPages,
                        prevPage: parseInt(params.page) > 1,
                        limit: parseInt(params.limit),
                        total: totalData
                    }
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};