import express from 'express';
import { SERVER_PORT } from './constants/env.constant.js';
import { apiRouter } from './routers/index.js';

const app = express();
const port = SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRouter);

app.get('/', (req, res) => {
  return res.json('hello world');
});
app.listen(port, async () => {
  console.log(`Server is listening on ${port}`);
});
