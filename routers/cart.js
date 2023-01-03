import express, { application } from "express";
import Cart from "../models/cart/index.js";
import CartProduct from "../models/cartProduct/index.js";
import { connection } from "../server.js";
import util from "util";
import Product from "../models/product/index.js";
import bodyParser from "body-parser";
import { verifier } from "../middleware/verifier.js";
import { query } from "../server.js";
const router = express.Router();

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", verifier, async (req, res) => {
  try {
    const r = new CartProduct(
      req.body.userID,
      req.body.productID,
      req.body.count
    );
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

router.delete("/", verifier, async (req, res) => {
  try {
    const r = new CartProduct(req.body.userID, req.body.productID);
    const sql = `DELETE FROM shopping.cart WHERE userID=${r.getUserID()} and productID=${r.getProductID()}`;
    const result = await query(sql);
    if (result.err) throw result.err;
    else res.status(200).send(result);
  } catch (error) {
    console.log(err);
    res.status(500).send({
      err: err.name,
      msg: "Database error",
    });
  }
});

router.get("/current", verifier, async (req, res) => {
  try {
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

router.post("/total", verifier, async (req, res) => {
  try {
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
      let find = `SELECT cost FROM shopping.product WHERE `;
      let j = 0;
      while (1) {
        find += `productID=${buy[j].productID}`;
        j++;
        if (j < buy.length) find += ` or `;
        else break;
      }
      const cost = await query(find);
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
