import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else return [];
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async #getMaxId() {
    try {
      let maxId = 0;
      const carts = await this.getCarts();
      carts.map((cart) => {
        if (cart.id > maxId) {
          maxId = cart.id;
        }
      });
      return maxId;
    } catch (error) {
      throw new Error("Error al obtener el maxid");
    }
  }

  async addCart() {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        products: [],
      };
      const cartsFile = await this.getCarts();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return cart;
    } catch (error) {
      throw new Error("Error al añadir un nuevo carrito");
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cid);
      if (!cart) {
        return false;
      }
      return cart;
    } catch (error) {
      throw new Error("Error al obtener un carrito por su id");
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const currentCart = await this.getCartById(Number(cid));
      if (currentCart) {
        const currentProduct = currentCart.products.find(
          (p) => p.product === Number(pid)
        );
        if (currentProduct) {
          currentProduct.quantity += 1;
        } else {
          const addedProduct = {
            product: Number(pid),
            quantity: 1,
          };
          currentCart.products.push(addedProduct);
        }
        const cartIndex = carts.findIndex((c) => c.id === Number(cid));
        if (cartIndex !== -1) {
          carts[cartIndex] = currentCart;
        } else {
          carts.push(currentCart);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return currentCart;
      }
    } catch (error) {
      throw new Error("Error al añadir un producto al carrito");
    }
  }
}