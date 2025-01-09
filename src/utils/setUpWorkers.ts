import { Job, Worker } from "bullmq";

export function  setUpWorkers(name: string): void {
  let defaultWorker: Worker = new Worker(name, async (job) => {
    console.log(`Processing job  ${job.id} with data ${job.data}`);
  }, {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
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