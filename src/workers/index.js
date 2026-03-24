const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const connection = require('../config/redis');
const connectDB = require('../config/db');

// Handlers
const { handleUserCreated, handleUserUpdated, handleUserDeleted } = require('./handlers/clerkHandler');

// Start DB
connectDB();

const worker = new Worker('webhook-events', async (job) => {
    console.log(`[Worker] Processing job: ${job.name}`);

    try {
        switch (job.name) {
            // Clerk
            case 'user.created':
                await handleUserCreated(job.data);
                break;
            case 'user.updated':
                await handleUserUpdated(job.data);
                break;
            case 'user.deleted':
                await handleUserDeleted(job.data);
                break;

            default:
                console.warn(`[Worker] Unhandled job type: ${job.name}`);
        }
    } catch (err) {
        console.error(`[Worker] Job Failed ${job.name}:`, err);
        throw err; // Trigger retry
    }
}, { connection });

worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed with ${err.message}`);
});

console.log('[Worker] Started listening for events...');
