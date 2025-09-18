import { mongooseConnect } from "@/lib/mongoose";
import { Notification } from "@/models/Notification";
import { Profile } from "@/models/Profile";
import { neon } from '@netlify/neon';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

 const sql = neon(); // Use process.env.DATABASE_URL if needed

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

export default async function handler(req, res) {

  const { method } = req;

  if (method === "POST") {
    const { email, password } = req.body;

    // Check if email exists in Neon
    try {
      const pgUsers = await sql`SELECT * FROM profiles WHERE email = ${email} AND password = ${password}`;  
      if (pgUsers.length > 0) {
        return res.status(400).json({
          success: true,
          error:false,
          message: `Welcome Back Admin ${pgUsers[0].fullname}!`,
          data: pgUsers[0],
          
        });
      }
    } catch (neonError) {
      console.error('Neon check email failed:', neonError);
       return res.status(400).json({
          success: false,
          error: true,
          message: `Sorry, this email ${email} is already taken`,
        });
      // // Fallback to Mongo
      // const existingUser = await Profile.findOne({ email });
      // if (existingUser) {
      //   return res.status(400).json({
      //     success: false,
      //     error: true,
      //     message: `Sorry, this email ${email} is already taken`,
      //   });
      // }
    }

    const randomNum = Math.floor(Math.random() * 100) + 1;
    const gender = randomNum % 2 === 0 ? 'female' : 'male';
    const imageNumber = Math.floor(Math.random() * 100);
    const id = uuidv4();
    const token = faker.string.uuid();
    const finalImage = image || `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${imageNumber}.jpg`;

    // Write to Neon
    try {
      await sql`
        INSERT INTO profiles (
          id, fullname, password, phonenumber, country, email, image, token
        ) VALUES (
          ${id}, ${fullName}, ${password}, ${phoneNumber}, ${Country}, ${email}, ${finalImage}, ${token}
        )`;

        try {
  await sql`
    INSERT INTO notifications (
      type, model, dataid, title, message, createddate
    ) VALUES (
      'add', 'Profile', ${id}, 'User Account Creation Recorded',
      ${`On ${formatDate(new Date())}, an admin account was for a new user account with full name ${fullName} (email: ${email}). Associated details: phone ${phoneNumber}. Recommend immediate verification to confirm identity and integrate into system workflows.`},
      CURRENT_TIMESTAMP
    )`;
 return res.status(200).json({
        success: true,
        error: false,
        message: "Account Created Successfully!",
        data: newUser,
      });

} catch (neonError) {
  // Handle error, perhaps rollback Profile if critical
}

             

    } catch (neonError) {
      return res.status(500).json({
        success: false,
        error: true,
        message: `Neon insert failed: ${neonError.message}`,
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