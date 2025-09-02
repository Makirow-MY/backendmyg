import { Notification } from '../../../models/Notification';
import { Blog } from '../../../models/Blog';
import { Comment } from '../../../models/Comment';
import { Contact } from '../../../models/contact';
//import { Transaction } from '../../../models/Payment';
import { Project } from '../../../models/Project';
import { Review } from '../../../models/Review';
//import Payment from '@/models/Payment';
//import Payment from '@/models/Payment';
//

function generateMessage(type, model, data) {
  let actionVerb = type === 'add' ? 'added' : 'updated';
  let messagePrefix = type === 'add' ? 'A new' : 'An existing';
  let subjectDetails = '';

  switch (model) {
    case 'Blog':
      const blogTitle = data.title ? `"${data.title}"` : 'an untitled blog post';
      const blogSlug = data.slug ? ` (slug: ${data.slug})` : '';
      const blogDescSnippet = data.description ? `. Description: "${data.description.substring(0, 100)}..."` : '';
      subjectDetails = `blog post ${blogTitle}${blogSlug}${blogDescSnippet}`;
      break;

    case 'Comment':
      const commenterName = data.name ? data.name : 'an anonymous user';
      const commenterEmail = data.email ? ` (${data.email})` : '';
      const commentContent = data.contentPera ? `: "${data.contentPera.substring(0, 100)}..."` : ' with no content provided';
      const commentTitle = data.title ? ` titled "${data.title}"` : '';
      const onBlog = data.blogTitle ? ` on blog "${data.blogTitle}"` : '';
      const isMain = data.mainComment ? ' (main comment)' : data.parentName ? ` (reply to ${data.parentName})` : '';
      subjectDetails = `comment${commentTitle} by ${commenterName}${commenterEmail}${commentContent}${onBlog}${isMain}`;
      break;

    case 'Contact':
      const contactFirstName = data.clientInfo?.firstName || 'an anonymous';
      const contactLastName = data.clientInfo?.lastName ? ` ${data.clientInfo.lastName}` : '';
      const contactEmail = data.clientInfo?.email ? ` (${data.clientInfo.email})` : '';
      const contactPhone = data.clientInfo?.phone ? `, phone: ${data.clientInfo.phone}` : '';
      const contactCompany = data.clientInfo?.company ? ` from company "${data.clientInfo.company}"` : '';
      const serviceType = data.serviceSelection?.serviceType ? ` regarding ${data.serviceSelection.serviceType}` : ' a general inquiry';
      const engagement = data.engagementType ? ` (engagement type: ${data.engagementType})` : '';
      subjectDetails = `contact inquiry from ${contactFirstName}${contactLastName}${contactCompany}${contactEmail}${contactPhone}${serviceType}${engagement}`;
      break;

    case 'Transaction':
      const transId = data.transactionId ? `${data.transactionId}` : 'an unidentified transaction';
      const payerFirstName = data.personal?.firstName || 'an anonymous';
      const payerLastName = data.personal?.lastName ? ` ${data.personal.lastName}` : '';
      const payerEmail = data.personal?.email ? ` (${data.personal.email})` : '';
      const amount = data.amount ? `${data.amount} ${data.currency || ''}` : 'an unspecified amount';
      const paymentMethod = data.payment?.method ? ` via ${data.payment.method}` : '';
      const itemsCount = data.cartItems?.length ? ` for ${data.cartItems.length} item(s)` : '';
      subjectDetails = `transaction ${transId} by ${payerFirstName}${payerLastName}${payerEmail} for ${amount}${paymentMethod}${itemsCount}`;
      break;

    case 'Project':
      const projectTitle = data.title ? `"${data.title}"` : 'an untitled project';
      const projectSlug = data.slug ? ` (slug: ${data.slug})` : '';
      const projectCat = data.projectcategory ? ` in category "${data.projectcategory}"` : '';
      const projectType = data.projectType ? ` (${data.projectType})` : '';
      const projectDescSnippet = data.description ? `. Description: "${data.description.substring(0, 100)}..."` : '';
      subjectDetails = `project ${projectTitle}${projectSlug}${projectCat}${projectType}${projectDescSnippet}`;
      break;

    case 'Review':
      const reviewerName = data.name ? data.name : 'an anonymous reviewer';
      const reviewerEmail = data.email ? ` (${data.email})` : '';
      const reviewMessage = data.message ? `: "${data.message.substring(0, 100)}..."` : ' with no message provided';
      const forProject = data.projectName ? ` for project "${data.projectName}"` : ' on an unspecified project';
      const rating = data.rating ? `. Rating: ${data.rating}` : '';
      const reviewerRole = data.role ? ` (role: ${data.role})` : '';
      subjectDetails = `review by ${reviewerName}${reviewerEmail}${reviewerRole}${forProject}${reviewMessage}${rating}`;
      break;

    default:
      subjectDetails = `${model.toLowerCase()} with ID ${data._id || 'unknown'}`;
  }

  return `${messagePrefix} ${subjectDetails} has been ${actionVerb}.`;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const models = [
        { Model: Blog, name: 'Blog' },
        { Model: Comment, name: 'Comment' },
        { Model: Contact, name: 'Contact' },
        //{ Model: Payment, name: 'Transaction' },
        { Model: Project, name: 'Project' },
        { Model: Review, name: 'Review' },
      ];

      for (const { Model, name } of models) {
        const docs = await Model.find({});
        console.log("{name, docs, Model}", {name, docs, Model});
        for (const doc of docs) {
          const existingNotifs = await Notification.find({
            type: 'add',
            model: name,
            dataId: doc._id,
            
          });
          if (existingNotifs.length > 1) {
            // Delete extras, keep the first one
            const keepId = existingNotifs[0]._id;
            await Notification.deleteMany({
              _id: { $in: existingNotifs.slice(1).map(n => n._id) }
            });
          }
          if (existingNotifs.length === 0) {
            const message = generateMessage('add', name, doc);
            const notif = new Notification({
              type: 'add',
              model: name,
              dataId: doc._id,
              message,
              read: false,
              createdAt: doc.createdAt, // Use original createdAt
            });
            await notif.save();
          }
        }
      }
      const notifications = await Notification.find({}).sort({ createdAt: -1 });
      res.status(200).json({ message: 'Notifications seeded successfully', data: notifications });
    } catch (error) {
      console.error('Error seeding notifications:', error);
      res.status(500).json({ error: 'Failed to seed notifications' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}