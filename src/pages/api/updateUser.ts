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
    const { updateUser } = req.body;
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const filter = { "username": updateUser.username }
    const options = { "upsert": false };
    const update = {
        $set: {
            level: updateUser.level,
            currentExp: updateUser.currentExp,
            challengesCompleted: updateUser.challengesCompleted,
            totalExp: updateUser.totalExp
        }
    }

    const collection = db.collection('users');

    let user = await collection.updateOne(filter, update, options);

    res.json({ msg: 'User updated successfull' });
}