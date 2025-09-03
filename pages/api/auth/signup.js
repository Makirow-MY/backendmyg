import { mongooseConnect } from "@/lib/mongoose";
import { Notification } from "@/models/Notification";
import { Profile } from "@/models/Profile";
import { faker } from '@faker-js/faker';

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
      try {
        const user = await Profile.findOne({ email: userEmail });
        if (!user) {
          return res.status(404).json({
            success: false,
            error: true,
            message: "User not found",
          });
        }
        console.log("User Email Provided", userEmail, user);
        return res.status(200).json({
          success: true,
          error: false,
          message: "User data retrieved successfully",
          data: user,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: true,
          message: "Server Error",
        });
      }
    }

    try {
      const existingUser = await Profile.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: true,
          message: `Sorry, this email ${email} is already taken`,
        });
      }

      const randomNum = Math.floor(Math.random() * 100) + 1;
      const gender = randomNum % 2 === 0 ? 'female' : 'male';
      const imageNumber = Math.floor(Math.random() * 100);

      const newUser = await Profile.create({
        email,
        password,
        fullName,
        phoneNumber,
        Country,
        image: image || `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${imageNumber}.jpg`,
        token: faker.string.uuid(),
      });

      // Create a professional notification for account creation
      await Notification.create({
        type: 'add',
        model: 'Profile',
        dataId: newUser._id,
        title: `New Administrative Account Registered`,
        message: `On ${formatDate(new Date(newUser.createdAt))}, a new administrative account was registered for ${newUser.fullName} (email: ${newUser.email}). The account includes verified details such as email, full name, phone number, country, and an optional profile image.`,
        createdDate: newUser.createdAt,
      });

      res.status(200).json({
        success: true,
        error: false,
        message: "Account Created Successfully!",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: true,
        message: "Server Error",
      });
    }
  }

  if (method === "PUT") {
    const { userEmail, ...updateData } = req.body;

    try {
      const user = await Profile.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "User not found",
        });
      }

      // Update only provided fields
      Object.keys(updateData).forEach((key) => {
        if (key !== "password" && key !== "token") { // Skip sensitive fields
          user[key] = updateData[key] !== undefined ? updateData[key] : user[key];
        }
      });

      await user.save();

      // Find existing notification for this user profile
      let existingNotification = await Notification.findOne({
        model: 'Profile',
        dataId: user._id,
      });

      if (existingNotification) {
        // Update the existing notification to reflect the latest changes
        existingNotification.type = 'update';
        existingNotification.title = `Administrative Account Profile Updated`;
        existingNotification.message = `On ${formatDate(new Date(user.updatedAt))}, the administrative account profile for ${user.fullName} (email: ${user.email}) was updated. Please review the user profile for detailed changes.`;
        existingNotification.createdDate = user.updatedAt;

        await existingNotification.save();
      } else {
        // Edge case: If no prior notification exists, create one for the update
        await Notification.create({
          type: 'update',
          model: 'Profile',
          dataId: user._id,
          title: `Administrative Account Profile Updated`,
          message: `On ${formatDate(new Date(user.updatedAt))}, the administrative account profile for ${user.fullName} (email: ${user.email}) was updated. Please review the user profile for detailed changes.`,
          createdDate: user.updatedAt,
        });
      }

      res.status(200).json({
        success: true,
        error: false,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: true,
        message: "Server Error",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: true,
    message: "Method not allowed",
  });
}