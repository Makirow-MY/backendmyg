import { mongooseConnect } from "@/lib/mongoose";
import { Contact } from "@/models/contact";
import { ObjectId } from 'mongodb';

export default async function handlecont(req, res) {
    await mongooseConnect();
    const { method } = req;

    try {
        if (method === "POST") {
            const { userId, name, lname, email, price, company, country, description, phone, project } = req.body;
            
            if (userId) {
                await Contact.deleteOne({ _id: new ObjectId(userId) });
                const contacts = await Contact.find().sort({ createdAt: -1 });
                return res.json({ success: true, data: contacts });
            }

            if (name && email && description && company && country && phone && price) {
                const contactDoc = await Contact.create({
                    name, lname, email, price, company, country, description, phone, project
                });
                return res.json({ success: true, data: contactDoc });
            }

            return res.status(400).json({ success: false, message: "Missing required fields" });

        } else if (method === "GET") {
            if (req.query?.id) {
                const contact = await Contact.findById(req.query.id);
                if (!contact) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Contact not found" 
                    });
                }
                return res.json({ success: true, data: contact });
            }

            const contacts = await Contact.find().sort({ createdAt: -1 });
            return res.json({ success: true, data: contacts });

        } else if (method === "PUT") {
            const { _id, ...updateData } = req.body;
            if (!_id) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing contact ID" 
                });
            }

            const updated = await Contact.findByIdAndUpdate(_id, updateData, { new: true });
            if (!updated) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Contact not found" 
                });
            }
            return res.json({ 
                success: true, 
                data: updated, 
                message: "Contact updated" 
            });

        } else if (method === "DELETE") {
            if (!req.query?.id) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing ID parameter" 
                });
            }

            const deleted = await Contact.findByIdAndDelete(req.query.id);
            if (!deleted) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Contact not found" 
                });
            }
            return res.json({ 
                success: true, 
                message: "Contact deleted" 
            });
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error",
            error: error.message 
        });
    }
}