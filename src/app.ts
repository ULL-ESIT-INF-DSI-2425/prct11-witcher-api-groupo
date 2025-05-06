import express from "express";
import "./db/mongoose.js";
import { goodsRouter } from "./routers/goodsRouter.js";
import { clientRouter } from './routers/clientsRouter.js';
import { merchantsRouter } from "./routers/merchantRouter.js";
import { transactionRouter } from "./routers/transactionRouter.js";
import { defaultRouter } from "./routers/default.js";

export const app = express();
app.use(express.json());
app.use(goodsRouter);
app.use(clientRouter);
app.use(merchantsRouter);
app.use(transactionRouter);
app.use(defaultRouter);