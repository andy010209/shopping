import express, { query } from "express";
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

export default router;
