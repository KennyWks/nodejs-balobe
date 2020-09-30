//nama market placenya "balobe"
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

//Logger
app.use(morgan("tiny"));

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Old Router
const ArtilceRouter = require("./src/routes/article");
const CategoryRouter = require("./src/routes/category");
const AuthRouter = require("./src/routes/auth");
const Users = require("./src/routes/user");

//new Router
const RoleRouter = require("./src/routes/role");
const PelapakRouter = require("./src/routes/pelapak");
const ItemRouter = require("./src/routes/item");
const CartsRouter = require("./src/routes/carts");

app.use("/article", ArtilceRouter);
app.use("/category", CategoryRouter);
app.use("/auth", AuthRouter);
app.use("/profile", Users);

app.use("/role", RoleRouter);
app.use("/pelapak", PelapakRouter);
app.use("/item", ItemRouter);
app.use("/carts", CartsRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      msg: err.message || "Internal Server Error",
    },
  });
});
const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
