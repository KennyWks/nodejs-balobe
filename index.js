//nama market placenya "balobe"
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//Logger
app.use(morgan("tiny"));

//cors
app.use(cors());

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// start line config for web scoket
const STATIC_CHANNELS = [
  {
    name: "Global chat",
    participants: 0,
    id: 1,
    sockets: [],
  },
  {
    name: "Funny",
    participants: 0,
    id: 2,
    sockets: [],
  },
];

io.on("connection", (socket) => {
  // socket object may be used to send specific messages to the new connected client
  console.log("new client connected");
  socket.emit("connection", null);
  socket.on("channel-join", (id) => {
    console.log("channel join", id);
    STATIC_CHANNELS.forEach((c) => {
      if (c.id === id) {
        if (c.sockets.indexOf(socket.id) == -1) {
          c.sockets.push(socket.id);
          c.participants++;
          io.emit("channel", c);
        }
      } else {
        let index = c.sockets.indexOf(socket.id);
        if (index != -1) {
          c.sockets.splice(index, 1);
          c.participants--;
          io.emit("channel", c);
        }
      }
    });

    return id;
  });
  socket.on("send-message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    STATIC_CHANNELS.forEach((c) => {
      let index = c.sockets.indexOf(socket.id);
      if (index != -1) {
        c.sockets.splice(index, 1);
        c.participants--;
        io.emit("channel", c);
      }
    });
  });
});

app.get("/getChannels", (req, res) => {
  res.status(200).send({
    channels: STATIC_CHANNELS,
  });
});
// end line config for web scoket

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
server.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
