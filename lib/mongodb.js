//

import { MongoClient } from "mongodb";

export default async function connectToDatabase() {
    
    const client =  new MongoClient("mongodb+srv://makiagodwill:ELPyfQF8Al7ZBIli@mydatase.b6v7i.mongodb.net/PortfolioDatabase");

    try {
        await client.connect();
        return client.db(); 
    } catch (error) {
       console.log("Error connecting to MongoDb: ", error)
        throw error;
    }
}