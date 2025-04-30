import express from "express";
import "./db/mongoose.js";
import { goodsRouter } from "./routers/goodsRouter.js";
//import { clientsRouter } from './routers/clientsRouter.js';
//import { merchantsRouter } from './routers/merchantsRouter.js';
//import { transactionsRouter } from './routers/transactionsRouter.js';
import { defaultRouter } from "./routers/default.js";

const app = express();
app.use(express.json());
app.use(goodsRouter);
// app.use(clientsRouter);
// app.use(merchantsRouter);
// app.use(transactionsRouter);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
