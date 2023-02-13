import express from "express";
import Product from "../models/product/index.js";
import { sqlProduct } from "../server.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const result = await sqlProduct.findAll();
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
    const newProduct = new Product(
      req.body.productID,
      req.body.count,
      req.body.detail,
      req.body.cost
    );
    const test = await sqlProduct.findAll({
      where: {
        productID: newProduct.getProductID(),
      },
    });
    if (test.err) throw test.err;
    else {
      if (test.length === 0) {
        try {
          const result = await sqlProduct.create({
            productID: newProduct.getProductID(),
            count: newProduct.getCount(),
            detail: newProduct.getDetail(),
            cost: newProduct.getCost(),
          });
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
        try {
          const result = await sqlProduct.update(
            {
              count: newProduct.getCount(),
              detail: newProduct.getDetail(),
              cost: newProduct.getCost(),
            },
            {
              where: {
                productID: newProduct.getProductID(),
              },
            }
          );
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
    const newProduct = new Product(
      req.body.productID,
      req.body.count,
      req.body.detail,
      req.body.cost
    );
    const test = await sqlProduct.findAll({
      where: {
        productID: newProduct.getProductID(),
      },
    });
    if (test.err) throw test.err;
    else {
      if (test.length === 0) {
        res.status(400).send("Product not found");
      } else {
        try {
          const result = await sqlProduct.update(
            {
              count: newProduct.getCount(),
              detail: newProduct.getDetail(),
              cost: newProduct.getCost(),
            },
            {
              where: {
                productID: newProduct.getProductID(),
              },
            }
          );
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
