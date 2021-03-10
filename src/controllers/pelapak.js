require('dotenv').config();
const firebaseAdmin = require("../config/firebase");
const {
    CreatePelapakModel,
    GetAllPelapakModel,
    GetDetailPelapakModel,
    UpdatePelapakModel,
    UpdateLogoModel
} = require("../models/pelapak");

exports.CreatePelapakController = async (req, res) => {
    try {
        if (!req.body.name || !req.body.description || !req.body.location) {
            throw new Error("Data pelapak can't be empty!")
        }

        const queryDataPelapak = await GetDetailPelapakModel(req.auth.id_user);

        if (queryDataPelapak[1][0]) {
            throw new Error("Your account is registered before")
        } else {
            const data = {
                id_owner: req.auth.id_user,
                name: req.body.name,
                logo: "default.jpg",
                description: req.body.description,
                location: req.body.location,
            }
            const resultQuery = await CreatePelapakModel(data);
            res.status(200).send({
                data: {
                    id_pelapak: resultQuery[1].insertId,
                    msg: "create pelapak success"
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
};

exports.GetDetailPelapakController = async (req, res) => {
    console.log(req);
    console.log(req.auth.id_user);
    try {
        const result = await GetDetailPelapakModel(req.auth.id_user);
        console.log(result);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                msg: "id not found"
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

exports.UpdatePelapakController = async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Please add data to update");
        }
        const dataUpdate = {};
        const fillAble = ['name', 'description', 'location'];
        fillAble.forEach((v) => {
            if (req.body[v]) {
                dataUpdate[v] = req.body[v];
            }
        });

        if (!Object.keys(dataUpdate).length > 0) {
            throw new Error("Please add data to update");
        }

        const result = await UpdatePelapakModel(req.auth.id_user, dataUpdate);
        console.log(result);
        res.status(200).send({
            data: {
                id: req.auth.id_user,
                msg: "your data pelapak account is updated"
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.UpdateLogoContoller = async (req, res) => {
    console.log(req.file);
    try {
        if (process.env.APP_ENV === 'development') {
            let webPath = req.file.path.replace(/\\/g, '/');
            const result = await UpdateLogoModel(webPath, req.auth.id_user);
            res.status(200).send({
                data: {
                    lokasiFile: webPath,
                    msg: "upload image is success"
                }
            })
        } else {
            const pathFile = `img-logo/${req.auth.id_user}.${req.file.mimetype.split("/")[1]}`;
            const resultUpdate = await UpdateLogoModel(pathFile, req.auth.id_user);
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
        res.status(404).send({
            error: {
                msg: error.message || "Something wrong"
            }
        })
    }
}

exports.GetAllPelapakContoller = async (req, res) => {
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

        const result = await GetAllPelapakModel(params);
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