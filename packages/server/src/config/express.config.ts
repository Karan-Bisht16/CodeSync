import cors from 'cors';
import express from "express";
// importing config
import { corsOptions } from './cors.config.js';
// importing types
import type { Application } from "express";

const app: Application = express();

app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

export default app;