import { Queue } from 'bullmq';
import { redisConnection } from "../config/redis";
import { setUpWorkers } from '../utils/setUpWorkers';

const myQueue = new Queue('myQueue', {
  connection: redisConnection
});

setUpWorkers('myQueue');

export { myQueue };
