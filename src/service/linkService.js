const crypto = require("crypto");

const {
  dbGetLinkByLinkId,
  dbCreateLink,
  dbUpdateLink,
  dbDeleteLink,
  dbGetLinkByObjectId,
  dbGetTopHits,
  dbGetLatest,
  dbGetLinksByUser,
} = require("../dao/linkDao");

//The idea of seperating the service and db operations is awsome, the service functions can do more complecate works using the functions provided by dao.
async function findUrl(linkId) {
  const link = await dbGetLinkByLinkId(linkId);
  link.hits++;
  await dbUpdateLink(link);
  return link.url;
}

async function createLink(link) {
  link.ts = new Date();
  link.hits = 0;
  const objectId = await dbCreateLink(link);
  const linkResult = await dbGetLinkByObjectId(objectId);
  const linkId = await generateUniqueLinkId(objectId);
  linkResult.linkId = linkId;
  linkResult._id = objectId;
  await dbUpdateLink(linkResult);
  return linkId;
}

async function getLink(linkId) {
  return await dbGetLinkByLinkId(linkId);
}

async function updateLink(link) {
  await dbUpdateLink(link);
  return await dbGetLinkByLinkId(link.linkId);
}

async function deleteLink(linkId) {
  await dbDeleteLink(linkId);
}

async function generateUniqueLinkId(objectId) {
  let linkId = generateLinkId(objectId);
  while (true) {
    try {
      await dbGetLinkByLinkId(linkId);
    } catch (e) {
      break;
    }
    linkId = generateLinkId(objectId);
  }
  return linkId;
}

async function getHubLinks(user) {
  const topHits = await dbGetTopHits();
  const latest = await dbGetLatest();
  if (user) {
    const yourLinks = await dbGetLinksByUser(user);
    return { yourLinks, topHits, latest };
  } else {
    return { topHits, latest };
  }
}

//Good to know this crypto and createHash thing!
function generateLinkId(objectId) {
  const sha = crypto.createHash("sha1");
  sha.update(objectId.toString() + new Date());
  return btoa(sha.digest("hex").substring(0, 7)).replaceAll("=", "");
}

module.exports = {
  createLink,
  findUrl,
  getLink,
  updateLink,
  deleteLink,
  getHubLinks,
};
