import url from 'url';
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
    const { loggedUser } = req.body;
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('users');

    let user = await collection.findOne({
        username: loggedUser.username
    })

    if (!user) {
        const result = await collection.insertOne({
            username: loggedUser.username,
            name: loggedUser.name,
            githubAvatar: loggedUser.githubAvatar,
            level: 1,
            currentExp: 0,
            challengesCompleted: 0,
            totalExp: 0
        })
        user = result.ops[0];
    }

    res.json({ loggedUser: user });
}