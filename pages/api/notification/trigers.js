//const { createNotification } = require('./notificationController');

const { createNotification } = require("./controller");

function setupNotificationTriggers(models, io) {
  const { Blog, Comment, Contact, Project, Review, Transaction } = models;

  // Blog notifications
  Blog.schema.post('save', async function (doc) {
    await createNotification(this.isNew ? 'add' : 'update', 'Blog', doc, io);
  });

  // Comment notifications
  Comment.schema.post('save', async function (doc) {
    await createNotification(this.isNew ? 'add' : 'update', 'Comment', doc, io);
  });

  // Contact notifications
  Contact.schema.post('save', async function (doc) {
    await createNotification(this.isNew ? 'add' : 'update', 'Contact', doc, io);
  });

  // Project notifications
  Project.schema.post('save', async function (doc) {
    await createNotification(this.isNew ? 'add' : 'update', 'Project', doc, io);
  });

  // Review notifications
  Review.schema.post('save', async function (doc) {
    await createNotification(this.isNew ? 'add' : 'update', 'Review', doc, io);
  });

  // Transaction notifications
  Transaction.schema.post('save', async function (doc) {
    await createNotification(this.isNew ? 'add' : 'update', 'Transaction', doc, io);
  });
}

module.exports = setupNotificationTriggers;