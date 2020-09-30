const RoleRouter = require("express").Router();

// auth for admin
const AuthAdmin = require("../middleware/auth_admin");

const {
    CreateRoleController,
    GetAllRoleController,
    GetDetailRoleController,
    UpdateRoleController,
    DeleteRoleController
} = require("../controllers/role");

RoleRouter.post("/", AuthAdmin, CreateRoleController);
RoleRouter.get("/", AuthAdmin, GetAllRoleController);
RoleRouter.get("/:id", AuthAdmin, GetDetailRoleController);
RoleRouter.patch("/:id", AuthAdmin, UpdateRoleController);
RoleRouter.delete("/:id", AuthAdmin, DeleteRoleController);

module.exports = RoleRouter;