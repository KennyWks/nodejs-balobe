const ApiRouter = require("express").Router();
const {
    GetAllProvincesData,
} = require("../controllers/api");

ApiRouter.get("/rajaongkir/province/:id", GetAllProvincesData);
// ApiRouter.get("/rajaongkir/city", GetAllCityData);

module.exports = ApiRouter;