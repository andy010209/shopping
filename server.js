import express from "express";
import userRouter from "./router/user.js";
import productRouter from "./router/product.js";
import cartRouter from "./router/cart.js";
import User from "./model/user/index.js";
import Product from "./model/product/index.js";
import Cart from "./model/cart/index.js";
import CartProduct from "./model/cartProduct/index.js";
import util from "util";
import dotenv from "dotenv";
import mysql from "mysql";
dotenv.config();

////////////
//改名稱駝峰
//clean code
//用class
//104
//寫前端
//readme
//github
//leetcode
//mark down
////////////
//全部都用oop
//catch
//正確回傳字串
///////////
//會員登入

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
            err:"",
            msg:"User not found"
        })
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

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => console.log("Server is running"));
