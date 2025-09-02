const { Schema, models, model } = require('mongoose');

const NotificationSchema = new Schema({
  type: {
    type: String,
    enum: ['add', 'update'],
    required: true
  },
  model: {
    type: String,
    enum: ['Blog', 'Comment', 'Contact', 'Project', 'Review', 'Transaction'],
    required: true
  },
  dataId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = models.Notification || model('Notification', NotificationSchema, 'notifications');