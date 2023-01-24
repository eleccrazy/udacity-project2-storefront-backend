import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import indexRouter from './handlers';

const app: express.Application = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', indexRouter);

app.get('/', function (req: Request, res: Response) {
  // Redirect all requests from the / endpoint to /api endpoint.
  res.redirect('/api');
});

app.listen(port, function () {
  console.log(`Check it on address http://localhost:${3000} `);
});

export default app;
