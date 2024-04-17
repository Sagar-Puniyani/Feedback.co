import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject= {}

async function dbConnect ():Promise <void> {
    if ( connection.isConnected) {
        console.log("Database is Already Connected");
        return;
    }

    try {
        const dbInstance = await mongoose.connect(process.env.DB_URL!);

        connection.isConnected = dbInstance.connections[0].readyState;
        console.log("Database connected Successfully ");
        
    } catch (error : any ) {
        console.log("DB Connection error : " , error.message);
        
        process.exit(1);
    }
}

export default dbConnect;
