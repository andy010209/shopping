import express from "express";
import Cart from "../cart/index.js";
import CartProduct from "../cartProduct/index.js";

export default class User {
  #userID;
  #name;
  #wallet;
  #history;
  constructor(userID, name, wallet) {
    this.#userID = userID;
    this.#name = name;
    this.#wallet = wallet;
    this.#history = [];
  }
  setPrevious(shopHistory, l) {
    let i = 0;
    while (i < l) {
      const c = this.#history.find(
        ({ id }) => id === parseInt(shopHistory[i].id)
      );
      console.log(shopHistory[i].id);
      console.log(c);
      console.log("================");
      console.log(shopHistory[i]);
      if (!c) {
        this.#history.push(shopHistory[i].getCartProduct());
      } else {
        //c.setNumber(shopHistory[i].getNumber());
        //c.setTotal(shopHistory[i].getTotal());
        c.number += shopHistory[i].getNumber();
        c.total += shopHistory[i].getTotal();
      }
      i++;
    }
  }
  getPrevious() {
    return this.#history;
  }
  setUserData(userID, name, wallet) {
    this.#userID = userID;
    this.#name = name;
    this.#wallet = wallet;
  }
  getUserData() {
    return {
      userID: this.#userID,
      name: this.#name,
      wallet: this.#wallet,
    };
  }
  getName(){
    return this.#name;
  }
  getNameLength(){
    return this.#name.length;
  }
}
