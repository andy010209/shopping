import util from "util";
import { connection } from "../server.js";
import jwt from "jsonwebtoken";

export async function login(req, res, next) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const sql = `SELECT * FROM shopping.userdata WHERE userName='${req.body.userName}'`;
    const userData = await query(sql);
    if (userData.err) throw userData.err;
    else {
      if (userData.length === 0)
        res.status(400).send(new Error("User not found"));
      else {
        if (req.body.password != userData[0].password)
          res.status(400).send(new Error("Wrong password"));
        else if (req.body.password === userData[0].password) {
          const payload = {
            userID: userData[0].userID,
            userName: userData[0].userName,
          };
          const secret = "123";
          const token = jwt.sign(payload, secret, { expiresIn: "1 day" });
          const sql1 = `UPDATE shopping.userdata SET token='${token}' WHERE userName='${req.body.userName}'`;
          await query(sql1);
          res.status(200).send({
            msg: "Login success",
            token: token,
          });
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
  next();
}

export async function verifier(req, res, next) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const secret = "123";
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, secret);
    const sql = `SELECT * FROM shopping.userdata WHERE userID=${decode.userID} and token='${token}'`;
    const result = await query(sql);
    if (result.err) throw result.err;
    else {
      if (result.length === 0)
        res.status(400).send(new Error("Verification failed"));
      else next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      err: error.name,
      msg: "Database error",
    });
  }
}
