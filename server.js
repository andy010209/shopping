import express from "express";
import userRouter from "./router/user.js";
import productRouter from "./router/product.js";
import cartRouter from "./router/cart.js";
import User from "./model/user/index.js";
import Cart from "./model/cart/index.js";
import util from "util";
import dotenv from "dotenv";
import mysql from "mysql";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
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
  res.render("frontend.html");
});

export let allProduct = [];
export let myCart = new Cart(0);
app.use(express.json());

app.post("/login", async (req, res) => {
  const query = util.promisify(connection.query).bind(connection);
  try {
    let sql = `SELECT * FROM shopping.userdata WHERE userName='${req.body.userName}'`;
    let result = await query(sql);
    if (result.err) throw result.err;
    else {
      if (result.length === 0) {
        res.status(400).send({
          err: "",
          msg: "User not found",
        });
      } else {
        let user = new User(
          result[0].userID,
          result[0].userName,
          result[0].wallet
        );
        res.status(200).send(user.getUserData());
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: err.name,
      msg: "",
    });
  }
});

app.get("/data", (req, res) => {
  res.json({
    name: "ej",
    age: 25,
  });
});

app.get("/test",(req,res)=>{
  const t=req.header('Authorization').replace('Bearer','');
  
  console.log(t);
  res.send("ok");
})


/////////////////////////////

/////////////////////////////
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => console.log("Server is running"));
