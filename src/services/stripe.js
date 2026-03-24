const Stripe = require('stripe');
const logger = require('../utils/logger');

let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
} else {
  logger.warn('STRIPE', 'STRIPE_SECRET_KEY not set — Stripe payments disabled');
}

module.exports = stripe;
