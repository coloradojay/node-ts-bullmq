import { Queue } from 'bullmq';
import { redisConnection } from "../config/redis";

const myQueue = new Queue('myQueue', {
  connection: redisConnection
});

export { myQueue };
