const crypto = require("crypto");

const {
  dbCreateComment,
  dbGetCommentByObjectId,
  dbGetCommentByCommentId,
  dbUpdateComment,
  dbDeleteComment,
  dbGetCommentsByLinkId,
} = require("../dao/commentDao");

//A great structure that seperates the DB and the service.

async function createComment(comment) {
  comment.ts = new Date();
  const objectId = await dbCreateComment(comment);
  const commentResult = await dbGetCommentByObjectId(objectId);
  const commentId = await generateUniqueCommentId(objectId);
  commentResult.commentId = commentId;
  commentResult._id = objectId;
  await dbUpdateComment(commentResult);
  return commentId;
}

async function getComment(commentId) {
  return await dbGetCommentByCommentId(commentId);
}

async function updateComment(comment) {
  await dbUpdateComment(comment);
  return await dbGetCommentByCommentId(comment.commentId);
}

async function deleteComment(commentId) {
  await dbDeleteComment(commentId);
}

async function getCommentsForLink(linkId) {
  return await dbGetCommentsByLinkId(linkId);
}

async function generateUniqueCommentId(objectId) {
  let commentId = generateCommentId(objectId);
  while (true) {
    try {
      await dbGetCommentByCommentId(commentId);
    } catch (e) {
      break;
    }
    commentId = generateCommentId(objectId);
  }
  return commentId;
}

// Now we know how to generate ids better, thanks!
function generateCommentId(objectId) {
  const sha = crypto.createHash("sha1");
  sha.update(objectId.toString() + new Date());
  return btoa(sha.digest("hex").substring(0, 7)).replaceAll("=", "");
}

module.exports = {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentsForLink,
};
