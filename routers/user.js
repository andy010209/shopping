import express from "express";
import { connection , query} from "../server.js";
import util from "util";
import { verifier } from "../middleware/verifier.js";
const router = express.Router();

router.post("/history", async (req, res) => {
  try {
    const sql = `SELECT productID,count,total,date FROM shopping.history WHERE userID=${req.body.userID}`;
    const result = await query(sql);
    console.log(result);
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
