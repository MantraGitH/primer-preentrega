import express from "express";
import productRouter from "./routers/ProductRouter.js";
import cartRouter from "./routers/CartRouter.js";

const server = express();
const PORT = 8080;

server.use(express.json());
server.use('/api/products', productRouter);
server.use('/api/carts', cartRouter);

server.listen(PORT, () => {
  console.log(`Server corriendo on port: ${PORT}`);
});