export default class CartProduct {
  #userID;
  #productID;
  #count;
  constructor(userID, productID, count) {
    this.#userID = userID;
    this.#productID = productID;
    this.#count = count;
  }
  getCartProduct() {
    return {
      userID: this.#userID,
      productID: this.#productID,
      count: this.#count,
    };
  }
  getUserID() {
    return this.#userID;
  }
  getProductID() {
    return this.#productID;
  }
  getCount() {
    return this.#count;
  }
  setCount(value) {
    this.#count += value;
  }
}
