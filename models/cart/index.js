import CartProduct from "../cartProduct/index.js";
export default class Cart {
  #cartCount;
  constructor() {
    this.#cartCount = [];
  }
  getCartLength() {
    return this.#cartCount.length;
  }
  getCartCount() {
    let s = [];
    for (let i = 0; i < this.#cartCount.length; i++) {
      s.push(this.#cartCount[i].getCartProduct());
    }
    return s;
  }
  setCartCount(product) {
    let i = 0;
    while (i < product.length) {
      this.#cartCount.push(
        new CartProduct(
          product[i].userID,
          product[i].productID,
          product[i].count
        )
      );
      i++;
    }
  }
}
