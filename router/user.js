import express, { query } from "express";
import User from "../model/user/index.js";
import { myCart } from "../server.js";
import Cart from "../model/cart/index.js";
import CartProduct from "../model/cartProduct/index.js";
import { connection } from "../server.js";
import util from "util";

const router = express.Router();

router.get("/history", async (req, res) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const sql = `SELECT productID,count,total,date FROM shopping.history WHERE userID=${req.body.userID}`;
    const result = await query(sql);
    if (result.err) throw result.err;
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      err: err.name,
      msg: "Database error",
    });
  }
});

router.get("/logout", (req, res) => {
  if (user.getNameLength() === 0) res.status(400).send("You haven't log in");
  else {
    user.name = "";
    res.status(200).send("Log out successfully");
  }
});

export default router;
