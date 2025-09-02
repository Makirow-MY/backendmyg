const {Schema, models, model}  = require('mongoose')

const PhotoSchema = new Schema({
    title:{
        type: String
    },
    slug:{
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    
},
    {
          timestamps: true
    }
);

export const Photos = models.Photos || model('Photos', PhotoSchema, 'photos');