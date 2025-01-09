import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import bodyparser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { myQueue } from './queues/myQueue';
import apiRouter from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullMQAdapter(myQueue)],
  serverAdapter,
});

app.use(compression());
app.use(cookieParser());
app.use(bodyparser.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', apiRouter);
app.use('/ui', serverAdapter.getRouter());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    message: 'Works as expected',
    info: {
      url: `${req.protocol}://${req.hostname}${req.path}`
    }
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
