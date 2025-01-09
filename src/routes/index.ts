import { Request, Response, Router } from 'express';
import { myQueue } from '../queues/myQueue';

const apiRouter = Router();

apiRouter.post('/enqueue', async (req: Request, res: Response): Promise<any> => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      message: 'Name and data are required'
    });
  }

  try {
    const job = await myQueue.add('myQueue', data);
    res.status(200).json({
      message: 'Job added to the queue',
      jobId: job.id
    });
  } catch (error)  {
    res.status(500).json({
      error: 'Failed to enqueue job.', details: (error as Error).message
    })
  }
});

apiRouter.get('/job/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Job ID is required'
    });
  }

  try {
    const job = await myQueue.getJob(id);
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get job.', details: (error as Error).message
    });
  }
});

export default apiRouter;