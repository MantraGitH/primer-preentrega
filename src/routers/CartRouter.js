import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";
import { CartManager } from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager("../src/data/products.json");
const cartManager = new CartManager("../src/data/carts.json");

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.addCart();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartManager.getCartById(Number(id));
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(Number(cid));
    const product = await productManager.getProductById(Number(pid));
    if (!cart) {
      res.status(404).json({ error: "Carritp no encontrado" });
      return;
    }
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    await cartManager.addProductToCart(cid, pid);
    const updatedCart = await cartManager.getCartById(Number(cid));
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;