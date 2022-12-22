import express, { application, query } from "express";
import Cart from "../model/cart/index.js";
import CartProduct from "../model/cartProduct/index.js";
import { connection } from "../server.js";
import util from "util";
import Product from "../model/product/index.js";
import bodyParser from "body-parser";
const router = express.Router();

router.use(express.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


router.post("/", async (req, res) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const r = new CartProduct(
      req.body.userID,
      req.body.productID,
      req.body.count
    );
    console.log("this is /cart");
    console.log(req.body);
    console.log(req.body.productID);
    console.log(r.getProductID());
    const sql = `SELECT * FROM shopping.product WHERE productID=${r.getProductID()}`;
    const check = await query(sql);
    if (check.err) throw err;
    else {
      if (check.length === 0) {
        res.status(400).send(new Error("Product not found"));
      } else {
        const c = new Product(
          check[0].productID,
          check[0].count,
          check[0].detail,
          check[0].cost
        );
        const sql1 = `SELECT * FROM shopping.cart WHERE userID=${r.getUserID()} and productID=${c.getProductID()}`;
        const prod = await query(sql1);
        if (prod.length === 0) {
          const sql2 = `INSERT INTO shopping.cart(userID,productID,count,paid) VALUES('${r.getUserID()}',${r.getProductID()},${r.getCount()},'N')`;
          const result = await query(sql2);
          if (result.err) throw result.err;
          else res.status(200).send({ msg: "Cart insert success" });
        } else {
          const p = new CartProduct(
            prod[0].userID,
            prod[0].productID,
            prod[0].count
          );
          const sql2 = `UPDATE shopping.cart SET count=${
            p.getCount() + r.getCount()
          } WHERE userID=${r.getUserID()} and productID=${c.getProductID()}`;
          const result = await query(sql2);
          if (result.err) throw result.err;
          else res.status(200).send({ msg: "Cart update success" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      err: error.name,
      msg: "Database error",
    });
  }
});

router.get("/current", async (req, res) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const sql = `SELECT userID,productID,count FROM shopping.cart`;
    const cur = await query(sql);
    if (cur.err) throw cur.err;
    else {
      if (cur.length === 0)
        res.status(200).send({ msg: "There is nothing in the cart" });
      else {
        const showCart = new Cart();
        showCart.setCartCount(cur);
        res.status(200).send(showCart.getCartCount());
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err: err.name,
      msg: "Database error",
    });
  }
});

router.post("/total", async (req, res) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const sql = `SELECT userID,productID,count FROM shopping.cart WHERE userID=${req.body.userID} and paid='N' ORDER BY productID ASC`;
    const buy = await query(sql);
    console.log(buy);
    if (buy.length === 0)
      res.status(400).send({
        err: "err",
        msg: "There is no product in the cart",
      });
    else {
      const his = [];
      let k = 0;
      while (k < buy.length) {
        his.push(
          new CartProduct(buy[k].userID, buy[k].productID, buy[k].count)
        );
        k++;
      }
      //console.log(his);
      let find = `SELECT cost FROM shopping.product WHERE `;
      let j = 0;
      while (1) {
        find += `productID=${buy[j].productID}`;
        j++;
        if (j < buy.length) find += ` or `;
        else break;
      }
      //console.log(find);
      const cost = await query(find);
      //console.log(cost);
      let i = 0;
      let sql1 = `INSERT INTO shopping.history(userID,productID,count,total,date) VALUES`;
      while (1) {
        sql1 += `(${his[i].getUserID()},${his[i].getProductID()},${his[
          i
        ].getCount()},${his[i].getCount() * cost[i].cost},'2022-12-17')`;
        i++;
        if (i < his.length) sql1 += `,`;
        else break;
      }
      console.log(sql1);
      const result = await query(sql1);
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err: err.name,
      msg: "Database error",
    });
  }
});

export default router;
