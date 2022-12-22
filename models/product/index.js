export default class Product {
  #productID;
  #count;
  #detail;
  #cost;
  constructor(productID, count, detail, cost) {
    this.#productID = productID;
    this.#count = count;
    this.#detail = detail;
    this.#cost = cost;
  }
  getProductID() {
    return this.#productID;
  }
  getCount() {
    return this.#count;
  }
  getDetail() {
    return this.#detail;
  }
  getCost() {
    return this.#cost;
  }
  getProductMessage() {
    return {
      productID: this.productID,
      count: this.#count,
      detail: this.#detail,
      cost: this.#cost,
    };
  }
  setProductMessage(count, detail, cost) {
    this.#count = count;
    this.#detail = detail;
    this.#cost = cost;
  }
}
