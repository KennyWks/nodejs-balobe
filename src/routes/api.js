const ApiRouter = require("express").Router();
const {
    GetCostData,
    GetAllCityData
} = require("../controllers/api");

ApiRouter.post("/rajaongkir/cost", GetCostData);
// ApiRouter.get("/rajaongkir/province/:id", GetAllProvincesData);
ApiRouter.get("/rajaongkir/city", GetAllCityData);

module.exports = ApiRouter;