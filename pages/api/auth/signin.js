import { Notification } from "@/models/Notification";
import { Profile } from "@/models/Profile";
import { neon } from '@netlify/neon';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const formatDate = (date) => {
  if (!date || isNaN(date)) {
    return '';
  }
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

export default async function handler(req, res) {

  const { method } = req;

  if (method === "POST") {
    const { email, password } = req.body;

    // Check if email exists in Neon
    try {
      const pgUsers = await sql`SELECT * FROM profiles WHERE email = ${email} AND password = ${password}`;  
      if (pgUsers.length > 0) {
        return res.status(200).json({
          success: true,
          error:false,
          message: `Welcome Back Admin ${pgUsers[0].fullname}!`,
          data: pgUsers[0],
          
        });
      }
      else{
return res.status(200).json({
          success: false,
          error: true,
          message: `Invalid Credentials, please check email or password`,
    
          
        });
      }
    } catch (neonError) {
      console.log('Neon check email failed:', neonError);
       return res.status(400).json({
          success: false,
          error: true,
          message: `Sorry, You can't be sign in, error occurred ${neonError.message }`,
        });
             

      }
    // // Write to Mongo
    // try {
    //   const newUser = await Profile.create({
    //     _id: id,
    //     email,
    //     password,
    //     fullName,
    //     phoneNumber,
    //     Country,
    //     image: finalImage,
    //     token,
    //   });

    //   // Create notification (Mongo)
    //   await Notification.create({
    //     type: 'add',
    //     model: 'Profile',
    //     dataId: newUser._id,
    //     title: `New Administrative Account Registered`,
    //     message: `On ${formatDate(new Date(newUser.createdAt))}, a new administrative account was registered for ${newUser.fullName} (email: ${newUser.email}). The account includes verified details such as email, full name, phone number, country, and an optional profile image.`,
    //     createdDate: newUser.createdAt,
    //   });

    //   return res.status(200).json({
    //     success: true,
    //     error: false,
    //     message: "Account Created Successfully!",
    //     data: newUser,
    //   });
    // } catch (mongoError) {
    //   // Rollback Neon
    //   try {
    //     await sql`DELETE FROM profiles WHERE id = ${id}`;
    //   } catch (rollbackError) {
    //     console.error('Rollback failed:', rollbackError);
    //   }
    //   return res.status(500).json({
    //     success: false,
    //     error: true,
    //     message: `Mongo insert failed: ${mongoError.message}`,
    //   });
    // }
  }


}