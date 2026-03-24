# Cron Jobs Documentation

## Overview
The backend now includes automated cron jobs that run on a schedule using `node-cron`. These jobs can perform background tasks like health checks, database maintenance, cache updates, etc.

## Current Cron Jobs

### 1. Every 14 Minutes
- **Schedule**: `*/14 * * * *`
- **Purpose**: Background tasks and periodic checks
- **File**: `src/services/cronJobs.js`

### 2. Every Hour
- **Schedule**: `0 * * * *`
- **Purpose**: Database maintenance and periodic updates

### 3. Every Day at Midnight
- **Schedule**: `0 0 * * *`
- **Purpose**: Daily cleanup and archival tasks

## Cron Expression Format
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7) (0 and 7 are Sunday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

### Common Patterns:
- `*/5 * * * *` - Every 5 minutes
- `*/14 * * * *` - Every 14 minutes (current)
- `0 * * * *` - Every hour
- `0 9 * * *` - Every day at 9 AM
- `0 0 * * 0` - Every Sunday at midnight
- `*/30 * * * *` - Every 30 minutes

## How to Customize

### Edit the 14-Minute Task

Open `src/services/cronJobs.js` and modify the `runBackgroundTask()` function:

```javascript
const runBackgroundTask = async () => {
  try {
    // Example 1: Process pending notifications
    await processPendingNotifications();
    
    // Example 2: Sync analytics data
    await syncAnalyticsData();
    
    // Example 3: Clean up expired sessions
    await cleanupExpiredSessions();
    
    // Example 4: Update cache
    await updateCache();

  } catch (error) {
    logger.error('Error running background task:', error);
    throw error;
  }
};
```

### Add a New Cron Job

In `src/services/cronJobs.js`, in the `initializeCronJobs()` function:

```javascript
// Every 30 minutes - Custom Task
const cronEvery30Minutes = cron.schedule('*/30 * * * *', async () => {
  try {
    logger.info('[CRON JOB] Running every 30 minutes task');
    // Your task here
    logger.info('[CRON JOB] 30-minute task completed successfully');
  } catch (error) {
    logger.error('[CRON JOB] Error in 30-minute task:', error.message);
  }
});

// Add to return object
return {
  cronEvery14Minutes,
  cronEvery30Minutes,  // New job
  cronHourly,
  cronDaily,
};
```

## Implementation Examples

### Example 1: Health Check & Database Cleanup
```javascript
const runBackgroundTask = async () => {
  try {
    // Check if Redis is connected
    if (redis.status !== 'ready') {
      logger.warn('Redis not connected');
    }

    // Clean up old logs
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await LogCollection.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });

    logger.info('Health check passed, cleanup completed');
  } catch (error) {
    logger.error('Error in background task:', error);
  }
};
```

### Example 2: Process Pending Tasks
```javascript
const runBackgroundTask = async () => {
  try {
    // Find all pending enrollments
    const pending = await Enrollment.find({ status: 'pending' });
    
    for (const enrollment of pending) {
      // Process each enrollment
      await processEnrollment(enrollment);
    }

    logger.info(`Processed ${pending.length} pending enrollments`);
  } catch (error) {
    logger.error('Error processing enrollments:', error);
  }
};
```

### Example 3: Update Analytics
```javascript
const runBackgroundTask = async () => {
  try {
    // Calculate daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await AnalyticsEvent.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    logger.info('Daily stats calculated:', stats);
  } catch (error) {
    logger.error('Error calculating stats:', error);
  }
};
```

## Monitoring

Cron jobs log their execution status. Check logs for:
- `[CRON JOB]` - Cron job start/completion
- Error messages if a job fails

Example log output:
```
[2024-03-24 10:14:00] [CRON JOB] Running every 14 minutes task
[2024-03-24 10:14:05] [CRON JOB] 14-minute task completed successfully
[2024-03-24 10:28:00] [CRON JOB] Running every 14 minutes task
```

## Testing

To test if cron jobs are running, you can temporarily set a shorter interval:

```javascript
// Test: Run every 1 minute instead of 14
const cronEvery14Minutes = cron.schedule('* * * * *', async () => {
  // Task will run every minute
});
```

## Graceful Shutdown

The server handles graceful shutdown:
- When the server receives SIGINT (Ctrl+C) or SIGTERM signal
- All cron jobs are stopped properly
- Database connection is closed
- Server exits cleanly

## Integration with Existing Services

the cron jobs can integrate with:
- **Database Models**: User, Course, Enrollment, Analytics, etc.
- **Services**: Razorpay, Bunny Stream, Clerk
- **Queue**: BullMQ - can trigger job creation from cron tasks
- **Cache**: Redis - can read/update cached data
- **Webhooks**: Can trigger webhook events from cron tasks

## Performance Notes

- Cron jobs run on the main thread
- For heavy operations, consider using BullMQ workers
- Each job should complete quickly to avoid blocking others
- Use `try-catch` to handle errors gracefully
- Monitor memory usage for long-running background tasks

## Troubleshooting

### Job not running?
- Check if cron expression is correct at [crontab.guru](https://crontab.guru)
- Verify logger shows job initialization message
- Check system time is correct

### Job taking too long?
- Split into smaller tasks
- Delegate to background workers (BullMQ)
- Add pagination for large database operations

### Memory leaks?
- Ensure database connections are closed
- Clean up event listeners
- Monitor with `process.memoryUsage()`
