const ArticleRouter = require("express").Router();
const AuthAdmin = require("../middleware/auth_admin");
const UploadFile = require("../middleware/upload/uploadImageArticle");

const {
    CreateArticleController,
    GetAllArticleController,
    GetDetailArticleController,
    DeleteArticleController,
    UpdateArticleController
} = require("../controllers/article");

ArticleRouter.post("/", AuthAdmin, UploadFile.single("image"), CreateArticleController);
ArticleRouter.get("/", GetAllArticleController);
ArticleRouter.get("/:id", GetDetailArticleController);
ArticleRouter.patch("/:id", AuthAdmin, UploadFile.single("image"), UpdateArticleController);
ArticleRouter.delete("/:id", AuthAdmin, DeleteArticleController);

module.exports = ArticleRouter;