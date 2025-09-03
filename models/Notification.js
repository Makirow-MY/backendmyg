const { Schema, models, model } = require('mongoose');

const NotificationSchema = new Schema({
  type: {
    type: String,
    enum: ['add', 'update'],
    required: true
  },
  model: {
    type: String,
    enum: ['Blog', 'Comment', 'Contact', 'Project', 'Review', 'Transaction', 'Profile'],
    required: true
  },
  dataId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
    message: {
    type: String,
    required: true
  },
  createdDate:{
    type: Date,
    default: Date.now
 },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = models.Notification || model('Notification', NotificationSchema, 'notifications');