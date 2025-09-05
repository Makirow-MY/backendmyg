//

import { MongoClient } from "mongodb";

export default async function connectToDatabase() {
    
    const client =  new MongoClient("mongodb://0.0.0.0/PortfolioDatabase");

    try {
        await client.connect();
        return client.db(); 
    } catch (error) {
       console.log("Error connecting to MongoDb: ", error)
        throw error;
    }
}