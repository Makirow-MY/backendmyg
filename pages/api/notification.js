import { Notification } from "@/models/Notification";
import { Review } from '@/models/Review';
import { defaultNotifications, generateRandomReviews } from '@/lib/default';
import multer from 'multer';
import path from 'path';

import { neon } from '@netlify/neon';
import { v4 as uuidv4 } from 'uuid';

 //  // Use your env if needed: neon(process.env.DATABASE_URL)
export default async function handler(req, res) {
const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

  const { method } = req;

  if (method === "GET") {
//await sql`DELETE FROM notifications WHERE read = false OR read = true`;
    let notifications = [];
  
    if(req.query.unread == 'true'){
      const IsFalse = false;
        
 
     try {
      const pgNotifications = await sql`SELECT * FROM notifications WHERE read = ${IsFalse} ORDER BY createddate DESC`;
      notifications = pgNotifications.map(pgNotif => ({
        _id: pgNotif.id,
        type: pgNotif.type,
        model: pgNotif.model,
        dataId: pgNotif.dataid,
        title: pgNotif.title,
        message: pgNotif.message,
        createdDate: pgNotif.createddate,
        read: pgNotif.read,
        createdAt: pgNotif.createdat,
        updatedAt: pgNotif.updatedat
      }));
    } catch (neonError) {
      console.error('Neon GET notifications failed:', neonError);
    
    }
   
    return res.json({
      success: true,
      data: notifications.length,
       message: "Notifications retrieved successfully",
     
    });
  }

 try {
      const pgNotifications = await sql`SELECT * FROM notifications ORDER BY createddate DESC`;
      notifications = pgNotifications.map(pgNotif => ({
        _id: pgNotif.id,
        type: pgNotif.type,
        model: pgNotif.model,
        dataId: pgNotif.dataid,
        title: pgNotif.title,
        message: pgNotif.message,
        createdDate: pgNotif.createddate,
        read: pgNotif.read,
        createdAt: pgNotif.createdat,
        updatedAt: pgNotif.updatedat
      }));
    } catch (neonError) {
      console.error('Neon GET notifications failed:', neonError);
    }
    return res.json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications
    });



  }

  if (method === "PUT") {
    const { id, read } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Notification ID required" });
    }
    try {
      await sql`UPDATE notifications SET read = ${read}, updatedat = CURRENT_TIMESTAMP WHERE id = ${id}`;
      await Notification.updateOne({ _id: id }, { read });
      return res.json({ success: true, message: "Notification updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: `Update failed: ${error.message}` });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed"
  });
}