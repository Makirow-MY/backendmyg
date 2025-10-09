import { Profile } from "@/models/Profile";


export default async function handler(req, res) {
    
    await mongooseConnect();

    const {method} = req;
  //  console.log("{method}", {method})
       if (method === "POST") {
        
    const {userEmail} = req.body;

    try {
        const existingUser = await Profile.findOne({email: userEmail})
    
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "User Doesn't Exist"
            })
        }
       
    
            return res.status(400).json({
                success: true,
                error: false,
                message: "User Already Exist",
                data: existingUser
            })
     

    } catch (error) {
        res.status(500).json({
            success: false,
            error: true,
            message:"Server Error"
        })
    }

}
else{
    console.log("OUTSIDE INSEDE")
}

}