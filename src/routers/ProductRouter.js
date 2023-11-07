import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";
import { productValidator } from "../middlewares/productValidator.js";

const router = Router();
const productManager = new ProductManager("../src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (!limit) {
      res.status(200).json(products);
    } else {
      const productsByLimit = await productManager.getProductsByLimit(limit);
      res.status(200).json(productsByLimit);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(Number(id));
    if (!product) {
      res.status(404).json({ error: "Product no encontrado" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", productValidator, async (req, res) => {
  try {
    const productCreated = await productManager.addProduct(req.body);
    res.status(200).json(productCreated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = { ...req.body };
    const { id } = req.params;
    const idNumber = Number(id);
    const productOk = await productManager.getProductById(idNumber);
    if (!productOk) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      await productManager.updateProduct(product, idNumber);
    }
    res.status(200).json({ success: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);
    await productManager.deleteProduct(idNumber);
    res.json({ success: "Producto borrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;