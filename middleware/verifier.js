import jwt from "jsonwebtoken";
import { sqlUser } from "../server.js";
export async function createUser(req, res, next) {
  try {
    const userData = await sqlUser.findAll({
      where: {
        userName: req.body.userName,
      },
    });
    if (userData.err) throw userData.err;
    else {
      if (userData.length != 0) res.status(400).send({
        msg: "User already exist"
      });
      else {
        const randomID=Math.random()*1000;
        const result = await sqlUser.create({
          userID: randomID,
          userName: req.body.userName,
          password: req.body.password
        })
        if (result.err) throw result.err;
        else {
          res.status(200).send({
            msg: "Create success!",
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
}

export async function login(req, res, next) {
  try {
    const userData = await sqlUser.findAll({
      where: {
        userName: req.body.userName,
      },
    });
    if (userData.err) throw userData.err;
    else {
      if (userData.length === 0) res.status(400).send();
      else {
        if (req.body.password != userData[0].password) res.status(400).send();
        else if (req.body.password === userData[0].password) {
          const payload = {
            userID: userData[0].userID,
            userName: userData[0].userName,
          };
          const secret = "123";
          const token = jwt.sign(payload, secret, { expiresIn: "1 day" });
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
    const secret = "123";
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, secret);
    const result=await sqlUser.findAll({
      where: {
        userID: decode.userID
      }
    })
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
