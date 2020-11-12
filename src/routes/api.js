const ApiRouter = require("express").Router();
const {
    GetAllProvincesData,
    GetAllCityData
} = require("../controllers/api");

ApiRouter.get("/rajaongkir/province/:id", GetAllProvincesData);
ApiRouter.get("/rajaongkir/city/:id", GetAllCityData);

module.exports = ApiRouter;