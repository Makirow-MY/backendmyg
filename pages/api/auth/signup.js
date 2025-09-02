import { mongooseConnect } from "@/lib/mongoose";
import { Profile } from "@/models/Profile";
import { faker } from '@faker-js/faker';

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === "POST") {
    const { email, password, fullName, image, phoneNumber, Country, userEmail, ...otherFields } = req.body;

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
        ...otherFields,
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