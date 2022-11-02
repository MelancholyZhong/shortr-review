const MongoClient = require("mongodb").MongoClient;

//Maybe the whole url can be a environment variable, it can be simplr.
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const url = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}`;
const client = new MongoClient(url);

const db = client.db("shortr");
const linksCollection = db.collection("links");
const commentsCollection = db.collection("comments");

module.exports = { linksCollection, commentsCollection };
