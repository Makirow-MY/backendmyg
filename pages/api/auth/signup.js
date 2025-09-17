import { mongooseConnect } from "@/lib/mongoose";
import { Notification } from "@/models/Notification";
import { Profile } from "@/models/Profile";
import { neon } from '@netlify/neon';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

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
  await mongooseConnect();
  const { method } = req;

  if (method === "POST") {
    const { email, password, fullName, image, phoneNumber, Country, userEmail } = req.body;
    
    if (userEmail) {
      let user = null;
      try {
        const pgUsers = await sql`SELECT * FROM profiles WHERE email = ${userEmail}`;
        if (pgUsers.length > 0) {
          const pgUser = pgUsers[0];
          user = {
            _id: pgUser.id,
            email: pgUser.email,
            fullName: pgUser.fullname,
            phoneNumber: pgUser.phonenumber,
            Country: pgUser.country,
            image: pgUser.image,
            token: pgUser.token,
            createdAt: pgUser.createdat,
            updatedAt: pgUser.updatedat
          };
        }
      } catch (neonError) {
        console.error('Neon GET user failed:', neonError);
      }
    
      if (!user) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        error: false,
        message: "User data retrieved successfully",
        data: user,
      });
    }

    // Check if email exists in Neon
    try {
      const pgUsers = await sql`SELECT * FROM profiles WHERE email = ${email}`;
      if (pgUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: true,
          message: `Sorry, this email ${email} is already taken`,
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

  if (method === "PUT") {
    const { userEmail, ...updateData } = req.body;
    
    let user = null;
    try {
      const pgUsers = await sql`SELECT * FROM profiles WHERE email = ${userEmail}`;
      console.log("PG USERS for update", pgUsers);
      if (pgUsers.length > 0) {
        const pgUser = pgUsers[0];
        user = {
          id: pgUser.id,
          email: updateData.email,
          fullname: updateData.fullName,
          phonenumber: updateData.phoneNumber,
          country: updateData.Country,
          image: pgUser.image,
          token: pgUser.token,
          
        };
      }
    } catch (neonError) {
      console.error('Neon GET user for update failed:', neonError);
    }
  
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // Update Neon
    try {
      const updateFields = {};
    
      Object.keys(user).forEach((key) => {
        if (key !== "password" && key !== "token") {
          updateFields[key] = user[key];
        }
      });
        console.log("\n\n updateFields", updateFields);
      await sql`
        UPDATE profiles SET
         email = ${updateData.email},
          fullname= ${updateData.fullName},
          phonenumber= ${updateData.phoneNumber},
          country= ${updateData.Country},
          updatedat = CURRENT_TIMESTAMP
        WHERE email = ${userEmail}
      `;
 //console.log("Update data:", updateData, "\n\n updateFields updateFields", updateFields);
    await sql`
    INSERT INTO notifications (
      type, model, dataid, title, message, createddate
    ) VALUES (
      'update', 'Profile', ${user.id}, 'User Profile Modification Logged',
      ${`Admin ${user.fullname} (email: ${user.email}) modified his profile on ${formatDate(new Date())}. Updates applied: phone to ${user.phonenumber}, country to ${user.country}. Ensure modifications comply with data management protocols and notify relevant stakeholders if applicable.`},
      CURRENT_TIMESTAMP
    )`;
       return res.status(200).json({
        success: true,
        error: false,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (neonError) {
      return res.status(500).json({
        success: false,
        error: true,
        message: `Neon update failed: ${neonError.message}`,
      });
    }

    // // Update Mongo
    // try {
    //   Object.keys(updateData).forEach((key) => {
    //     if (key !== "password" && key !== "token") {
    //       user[key] = updateData[key] !== undefined ? updateData[key] : user[key];
    //     }
    //   });
    //   await user.save();

    //   // Update/create notification (Mongo)
    //   let existingNotification = await Notification.findOne({
    //     model: 'Profile',
    //     dataId: user._id,
    //   });
    //   if (existingNotification) {
    //     existingNotification.type = 'update';
    //     existingNotification.title = `Administrative Account Profile Updated`;
    //     existingNotification.message = `On ${formatDate(new Date(user.updatedAt))}, the administrative account profile for ${user.fullName} (email: ${user.email}) was updated. Please review the user profile for detailed changes.`;
    //     existingNotification.createdDate = user.updatedAt;
    //     await existingNotification.save();
    //   } else {
    //     await Notification.create({
    //       type: 'update',
    //       model: 'Profile',
    //       dataId: user._id,
    //       title: `Administrative Account Profile Updated`,
    //       message: `On ${formatDate(new Date(user.updatedAt))}, the administrative account profile for ${user.fullName} (email: ${user.email}) was updated. Please review the user profile for detailed changes.`,
    //       createdDate: user.updatedAt,
    //     });
    //   }

    //   return res.status(200).json({
    //     success: true,
    //     error: false,
    //     message: "Profile updated successfully",
    //     data: user,
    //   });
    // } catch (mongoError) {
    //   return res.status(500).json({
    //     success: false,
    //     error: true,
    //     message: `Mongo update failed: ${mongoError.message}`,
    //   });
    // }
  }

  return res.status(405).json({
    success: false,
    error: true,
    message: "Method not allowed",
  });
}