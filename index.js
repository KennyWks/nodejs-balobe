//nama market placenya "balobe"
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

//Logger
app.use(morgan("tiny"));

//cors
app.use(cors());

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
const TransactionRouter = require("./src/routes/transaction");
const Api = require("./src/routes/api");

app.get("/", (req, res) => {
  res.status(200).send({
    msg: "welcome to balobe",
  });
});
app.use("/article", ArtilceRouter);
app.use("/category", CategoryRouter);
app.use("/auth", AuthRouter);
app.use("/profile", Users);

app.use("/role", RoleRouter);
app.use("/pelapak", PelapakRouter);
app.use("/item", ItemRouter);
app.use("/carts", CartsRouter);
app.use("/transaction", TransactionRouter);
app.use("/api", Api);

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
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
