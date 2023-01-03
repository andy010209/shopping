import express from "express";
import Product from "../models/product/index.js";
import { connection , query } from "../server.js";
import util from "util";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const result = await query("SELECT * FROM shopping.product");
    if (result.err) throw result.err;
    else {
      let i = 0;
      const allProduct = [];
      while (i < result.length) {
        allProduct.push(
          new Product(
            result[i].productID,
            result[i].count,
            result[i].detail,
            result[i].cost
          )
        );
        i++;
      }
      let j = 0;
      const show = [];
      while (j < allProduct.length) {
        show.push({
          ProductID: allProduct[j].getProductID(),
          Count: allProduct[j].getCount(),
          Detail: allProduct[j].getDetail(),
          Cost: allProduct[j].getCost(),
        });
        j++;
      }
      res.status(200).send(show);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: err.name,
      msg: "database error",
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const r = new Product(
      req.body.productID,
      req.body.count,
      req.body.detail,
      req.body.cost
    );
    const test = await query(
      "SELECT * FROM shopping.product WHERE productID=" + r.getProductID()
    );
    if (test.err) throw test.err;
    else {
      if (test.length === 0) {
        let sql = `INSERT INTO shopping.product(productID,count,detail,cost) VALUES(${r.getProductID()},${r.getCount()},'${r.getDetail()}',${r.getCost()})`;
        try {
          const result = await query(sql);
          if (result.err) throw result.err;
          else res.status(200).send("Product inserted");
        } catch (err) {
          console.log(err);
          res.status(400).send({
            err: err.name,
            msg: "database error",
          });
        }
      } else {
        let sql = `UPDATE shopping.product SET productID=${r.getProductID()},count=${r.getCount()},detail='${r.getDetail()}',cost=${r.getCost()} WHERE productID=${r.getProductID()}`;
        
        try {
          const result = await query(sql);
          if (result.err) throw result.err;
          else res.status(200).send("Product updated");
        } catch (err) {
          console.log(err);
          res.status(400).send({
            err: err.name,
            msg: "database error",
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: err.name,
      msg: "database error",
    });
  }
});

router.patch("/", async (req, res) => {
  try {
    const r = new Product(
      req.body.productID,
      req.body.count,
      req.body.detail,
      req.body.cost
    );
    const test = await query(
      "SELECT * FROM shopping.product WHERE productID=" + r.getProductID()
    );
    console.log(test);
    if (test.err) throw test.err;
    else {
      if (test.length === 0) {
        res.status(400).send("Product not found");
      } else {
        let sql = `UPDATE shopping.product SET productID=${r.getProductID()},count=${r.getCount()},detail='${r.getDetail()}',cost=${r.getCost()} WHERE productID=${r.getProductID()}`;
        try {
          const result = await query(sql);
          if (result.err) throw result.err;
          else res.status(200).send("Product updated");
        } catch (err) {
          console.log(err);
          res.status(400).send({
            err: err.name,
            msg: "database error",
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: err.name,
      msg: "database error",
    });
  }
});

export default router;
