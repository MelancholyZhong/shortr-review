const { linksCollection } = require("../db");

async function dbCreateLink(link) {
  const result = await linksCollection.insertOne(link);
  if (!result || !result.acknowledged || !result.insertedId) {
    throw new Error("Insertion Failed");
  }
  return result.insertedId;
}

async function dbGetLinkByObjectId(objectId) {
  const link = await linksCollection.findOne({ _id: objectId });
  if (!link) {
    throw new Error("Lookup Failed");
  }
  cleanOutput(link);
  return link;
}

async function dbGetLinkByLinkId(linkId) {
  const link = await linksCollection.findOne({ linkId });
  if (!link) {
    throw new Error("Lookup Failed");
  }
  cleanOutput(link);
  return link;
}

async function dbUpdateLink(link) {
  let result;
  if (link._id) {
    result = await linksCollection.updateOne({ _id: link._id }, { $set: link });
  } else {
    result = await linksCollection.updateOne(
      { linkId: link.linkId },
      { $set: link }
    );
  }
  if (!result || !result.acknowledged) {
    throw new Error("Update Failed");
  }
}

async function dbDeleteLink(linkId) {
  const result = await linksCollection.deleteOne({ linkId });
  if (!result || !result.acknowledged || result.deletedCount !== 1) {
    throw new Error("Delete Failed");
  }
}

// This usage of sorting and limit the query result as the top hits is brilliant.
async function dbGetTopHits() {
  const result = await linksCollection.find().sort({ hits: "desc" }).limit(10);
  if (!result) {
    throw new Error("Get top hits Failed");
  }
  const links = await result.toArray();
  links.forEach(cleanOutput);
  return links;
}

async function dbGetLatest() {
  const result = await linksCollection.find().sort({ ts: "desc" }).limit(10);
  if (!result) {
    throw new Error("Get latest Failed");
  }
  const links = await result.toArray();
  links.forEach(cleanOutput);
  return links;
}

async function dbGetLinksByUser(user) {
  const result = await linksCollection.find({ user }).sort({ ts: "desc" });
  if (!result) {
    throw new Error("Get latest Failed");
  }
  const links = await result.toArray();
  links.forEach(cleanOutput);
  return links;
}

function cleanOutput(link) {
  delete link._id;
  delete link.ts;
}

module.exports = {
  dbCreateLink,
  dbGetLinkByLinkId,
  dbUpdateLink,
  dbDeleteLink,
  dbGetLinkByObjectId,
  dbGetTopHits,
  dbGetLatest,
  dbGetLinksByUser,
};
