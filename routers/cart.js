import express from "express";
import Cart from "../models/cart/index.js";
import CartProduct from "../models/cartProduct/index.js";
import { sequelize, sqlCart, sqlProduct } from "../server.js";
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
    const newCartProduct = new CartProduct(
      req.body.userID,
      req.body.productID,
      req.body.count
    );
    const check = await sqlProduct.findAll({
      where: {
        productID: newCartProduct.getProductID(),
      },
    });
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
        const prod = await sqlCart.findAll({
          where: {
            userID: newCartProduct.getUserID(),
            productID: c.getProductID(),
          },
        });
        if (prod.length === 0) {
          const result = await sqlCart.create({
            userID: newCartProduct.getUserID(),
            productID: newCartProduct.getProductID(),
            count: newCartProduct.getCount(),
            paid: "N",
          });
          if (result.err) throw result.err;
          else res.status(200).send({ msg: "Cart insert success" });
        } else {
          const preCartProduct = new CartProduct(
            prod[0].userID,
            prod[0].productID,
            prod[0].count
          );
          const result=await sqlCart.update({
            count: preCartProduct.getCount()+newCartProduct.getCount()
          },{
            where: {
              userID: newCartProduct.getUserID(),
              productID: c.getProductID()
            }
          })
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
    const delCartProduct = new CartProduct(req.body.userID, req.body.productID);
    const result =await sqlCart.destroy({
      where: {
        userID: delCartProduct.getUserID(),
        productID: delCartProduct.getProductID()
      }
    })
    if (result.err) throw result.err;
    else res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      err: error.name,
      msg: "Database error",
    });
  }
});

router.get("/current", verifier, async (req, res) => {
  try {
    const cur=await sqlCart.findAll({});
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
    const buy=await sqlCart.findAll({
      order: sequelize.col('productID')
    })
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
      sqlCart.hasOne(sqlProduct,{
        foreignKey: "productID",
        sourceKey: "productID"
      });
      const cal = await sqlCart.findAll({
        include: sqlProduct
      });
      console.log(cal[0].toJSON());
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
