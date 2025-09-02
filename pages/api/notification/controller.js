const { Notification } = require('../../../models/Notification');

function generateMessage(type, model, data) {
  const actionVerb = type === 'add' ? 'added' : 'updated';
  const messagePrefix = type === 'add' ? 'A new' : 'An existing';
  let subjectDetails = '';

  switch (model) {
    case 'Blog':
      const blogTitle = data.title ? `"${data.title}"` : 'an untitled blog post';
      const blogSlug = data.slug ? ` (slug: ${data.slug})` : '';
      const blogDesc = data.description ? `. Description: "${data.description.substring(0, 100)}..."` : '';
      subjectDetails = `blog post ${blogTitle}${blogSlug}${blogDesc}`;
      break;
    case 'Comment':
      const commenterName = data.name || 'an anonymous user';
      const commenterEmail = data.email ? ` (${data.email})` : '';
      const commentContent = data.contentPera ? `: "${data.contentPera.substring(0, 100)}..."` : '';
      const commentTitle = data.title ? ` titled "${data.title}"` : '';
      const onBlog = data.blogTitle ? ` on blog "${data.blogTitle}"` : '';
      subjectDetails = `comment${commentTitle} by ${commenterName}${commenterEmail}${commentContent}${onBlog}`;
      break;
    case 'Contact':
      const contactName = data.clientInfo?.firstName || 'an anonymous';
      const contactLastName = data.clientInfo?.lastName ? ` ${data.clientInfo.lastName}` : '';
      const contactEmail = data.clientInfo?.email ? ` (${data.clientInfo.email})` : '';
      const serviceType = data.serviceSelection?.serviceType || 'a general inquiry';
      subjectDetails = `contact inquiry from ${contactName}${contactLastName}${contactEmail} regarding ${serviceType}`;
      break;
    case 'Project':
      const projectTitle = data.title ? `"${data.title}"` : 'an untitled project';
      const projectSlug = data.slug ? ` (slug: ${data.slug})` : '';
      const projectCat = data.projectcategory ? ` in category "${data.projectcategory}"` : '';
      subjectDetails = `project ${projectTitle}${projectSlug}${projectCat}`;
      break;
    case 'Review':
      const reviewerName = data.name || 'an anonymous reviewer';
      const reviewerEmail = data.email ? ` (${data.email})` : '';
      const forProject = data.projectName ? ` for project "${data.projectName}"` : '';
      const rating = data.rating ? `. Rating: ${data.rating}` : '';
      subjectDetails = `review by ${reviewerName}${reviewerEmail}${forProject}${rating}`;
      break;
    case 'Transaction':
      const transId = data.transactionId || 'an unidentified transaction';
      const payerName = data.personal?.firstName || 'an anonymous';
      const payerLastName = data.personal?.lastName ? ` ${data.personal.lastName}` : '';
      const amount = data.amount ? `${data.amount} ${data.currency || ''}` : 'an unspecified amount';
      subjectDetails = `transaction ${transId} by ${payerName}${payerLastName} for ${amount}`;
      break;
    default:
      subjectDetails = `${model.toLowerCase()} with ID ${data._id || 'unknown'}`;
  }

  return `${messagePrefix} ${subjectDetails} has been ${actionVerb}.`;
}

async function createNotification(type, model, data, io) {
  const existing = await Notification.findOne({ type, model, dataId: data._id });
  if (existing) return; // Prevent duplicates

  const message = generateMessage(type, model, data);
  const notification = new Notification({
    type,
    model,
    dataId: data._id,
    message,
    read: false,
    createdAt: data.createdAt || Date.now()
  });

  await notification.save();
  io.emit('notification', notification); // Broadcast to all clients
}

async function getNotifications(req, res) {
  const { page = 1, limit = 10, model = 'All', date = 'All' } = req.query;
  const query = {};

  if (model !== 'All') query.model = model;
  if (date !== 'All') {
    const now = new Date();
    let startDate, endDate;
    switch (date) {
      case 'Today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'Yesterday':
        startDate = new Date(now.setDate(now.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case '2 days ago':
        startDate = new Date(now.setDate(now.getDate() - 2));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case '1 week ago':
        startDate = new Date(now.setDate(now.getDate() - 7));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case '2 weeks ago':
        startDate = new Date(now.setDate(now.getDate() - 14));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case '1 month ago':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      default:
        break;
    }
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
  }

  try {
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, read: false });

    res.status(200).json({ notifications, total, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

async function markNotificationRead(req, res) {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
}

async function markAllNotificationsRead(req, res) {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
}

module.exports = { createNotification, getNotifications, markNotificationRead, markAllNotificationsRead };