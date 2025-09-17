const { Schema, models, model } = require('mongoose');
const ProfileSchema = new Schema({
    _id: { type: String },
    fullName: { type: String },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "+23751497070" },
    Country: { type: String, default: "Cameroon" },
    email: { type: String, required: true },
    image: { type: String, default: "https://ui-avatars.com/api/?name=Makia%20Yengue&background=random" },
    token: { type: String },
}, {
    timestamps: true,
    strict: false
});
export const Profile = models.Profile || model('Profile', ProfileSchema, 'admin');