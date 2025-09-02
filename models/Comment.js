const {Schema, models, model}  = require('mongoose')

const CommentSchema = new Schema({
 name:{
    type: String,
    required: true
 },
  image:{
    type: String,
    
 },
 email:{
    type: String,
   
 },
 title:{
    type: String,
 
 },
  
contentPera:{
    type: String,
    
 },
 mainComment:{
    type: Boolean,
   
 },
 createdAt:{
    type: Date,
    default: Date.now
 },
 blog:{
    type: Schema.Types.ObjectId,
        ref: 'Blog',
      
 },
  blogTitle: { type: String },
  parent:{
   type: Schema.Types.ObjectId,
        ref: 'Comment',
  },
    children:[{
   type: Schema.Types.ObjectId,
        ref: 'Comment',
  }],

parentName:{
    type: String,
    
 },
 parentImage:{
    type: String,
   
 },

 

},
    {
          timestamps: true
    }
);
CommentSchema.post('save', async function (doc) {
  const type = this.isNew ? 'add' : 'update';
  const message = generateMessage(type, 'Comment', doc); // Define generateMessage as above
  const notif = new Notification({ type, model: 'Comment', dataId: doc._id, message });
  await notif.save();
  io.emit('new_notification', notif); // Emit via socket
});
export const Comment = models.Comment || model('Comment', CommentSchema, 'comments');