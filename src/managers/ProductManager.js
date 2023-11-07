import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(obj) {
    try {
      const product = {
        id: (await this.#getMaxId()) + 1,
        status: true,
        ...obj,
      };
      const products = await this.getProducts();
      const duplicatedCode = products.find(
        (product) => product.code === obj.code
      );
      if (duplicatedCode) {
        console.log("codigo duplicado");
        throw new Error("codigo duplicado");
      }
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return product;
    } catch (error) {
      throw new Error("Error al añadir un producto");
    }
  }

  async #getMaxId() {
    try {
      let maxId = 0;
      const products = await this.getProducts();
      products.map((product) => {
        if (product.id > maxId) {
          maxId = product.id;
        }
      });
      return maxId;
    } catch (error) {
      throw new Error("Error al obtener el max id");
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const productsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productsJSON);
      } else return [];
    } catch (error) {
      throw new Error("Error al obtener los producto");
    }
  }

  async getProductsByLimit(limit) {
    try {
      const products = await this.getProducts();
      if (!limit || limit >= products.length) {
        return products;
      } else {
        return products.slice(0, limit);
      }
    } catch (error) {
      throw new Error("Error al obtener los productos por limite");
    }
  }

  async getProductById(pid) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === pid);
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado");
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error("Error al obtener un producto por su id");
    }
  }

  async updateProduct(obj, id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return false;
      } else {
        const prodUpdated = { id, ...obj };
        products[index] = prodUpdated;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      if (products.length === updatedProducts.length) {
        console.error("Producto no encontrado...");
        return;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
    } catch (error) {
      throw new Error("Error al borrar el producto");
    }
  }
}