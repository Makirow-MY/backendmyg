
import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
       return mongoose.connection.asPromise(); 
    } else {
        const url =  "mongodb+srv://makiagodwill:ELPyfQF8Al7ZBIli@mydatase.b6v7i.mongodb.net/PortfolioDatabase";
        return mongoose.connect(url)
    }
}