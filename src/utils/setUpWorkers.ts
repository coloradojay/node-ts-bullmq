import { Job, Worker } from "bullmq";
import { redisConnection } from "../config/redis";

export function  setUpWorkers(name: string): void {
  let defaultWorker: Worker = new Worker(name, async (job) => {
    console.log(`Processing job  ${job.id} with data ${job.data}`);
  }, {
    connection: redisConnection,
    autorun: true,
  });

  defaultWorker.on('completed', (job: Job, returnvalue: 'DONE') => {
		console.debug(`Completed job with id ${job.id}`, returnvalue);
	});

	defaultWorker.on('active', (job: Job<unknown>) => {
		console.debug(`Completed job with id ${job.id}`);
	});

	defaultWorker.on('error', (failedReason: Error) => {
		console.error(`Job encountered an error`, failedReason);
	});
}