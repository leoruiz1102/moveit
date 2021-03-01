import { NowRequest, NowResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';

let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
    if (cachedDb) {
        return cachedDb;
    }

    const dbName = new URL(uri).pathname.substr(1);

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const db = client.db(dbName)

    cachedDb = db;

    return db;
}

export default async (req: NowRequest, res: NowResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('users');

    let users = await collection.find().sort({ totalExp: -1 }).toArray();

    res.json(users);
}