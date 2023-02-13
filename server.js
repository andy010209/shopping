import express from "express";
import loginRouter from "./routers/login.js";
import userRouter from "./routers/user.js";
import productRouter from "./routers/product.js";
import cartRouter from "./routers/cart.js";
import Cart from "./models/cart/index.js";
import util from "util";
import dotenv from "dotenv";
import mysql from "mysql";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { Sequelize } from "sequelize";
import config from "./config.js";
dotenv.config();

const app = express();
const port = 1000;

export const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: "",
  port: process.env.PORT,
  database: process.env.DATABASE,
});

connection.connect();

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
    },
  }
);
export const sqlProduct = sequelize.define(
  "product",
  {
    productID: Sequelize.INTEGER,
    count: Sequelize.INTEGER,
    detail: Sequelize.STRING(50),
    cost: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
export const sqlUser=sequelize.define(
  "userdata",
  {
    userID: Sequelize.INTEGER,
    userName: Sequelize.STRING(50),
    password: Sequelize.STRING(50),
    googleID: Sequelize.STRING(50),
    accessToken: Sequelize.STRING(500),
    refreshToken: Sequelize.STRING(500),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)
export const sqlCart=sequelize.define(
  "cart",
  {
    userID: Sequelize.INTEGER,
    productID: Sequelize.INTEGER,
    count: Sequelize.INTEGER,
    paid: Sequelize.STRING(5)
  },{
    timestamps: false,
    freezeTableName: true,
  }
)

export const query = util.promisify(connection.query).bind(connection);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("html", hbs.__express);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "shopping")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.render("homePage.html");
});

app.get("/p", async (req, res) => {
  let p = await sqlProduct.findAll({
    where: {
      count: 7,
    },
  });
  console.log(p);
  for (let k of p) {
    console.log(JSON.stringify(k));
  }
  res.send(p);
});

export let allProduct = [];
export let myCart = new Cart(0);
app.use(express.json());

app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => console.log("Server is running"));
