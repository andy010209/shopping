import express from "express";
import userRouter from "./routers/user.js";
import productRouter from "./routers/product.js";
import cartRouter from "./routers/cart.js";
import User from "./models/user/index.js";
import Cart from "./models/cart/index.js";
import util from "util";
import dotenv from "dotenv";
import mysql from "mysql";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { login, verifier } from "./middleware/verifier.js";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("html", hbs.__express);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "shopping")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.render("homePage.html");
});

export let allProduct = [];
export let myCart = new Cart(0);
app.use(express.json());

app.post("/login", login);

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => console.log("Server is running"));
