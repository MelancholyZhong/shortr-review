const { commentsCollection } = require("../db");
//This is very good that you putted all the DB functions together.

async function dbCreateComment(comment) {
  const result = await commentsCollection.insertOne(comment);
  if (!result || !result.acknowledged || !result.insertedId) {
    throw new Error("Insertion Failed");
  }
  return result.insertedId;
}

async function dbGetCommentByObjectId(objectId) {
  const comment = await commentsCollection.findOne({ _id: objectId });
  if (!comment) {
    throw new Error("Lookup Failed");
  }
  cleanOutput(comment);
  return comment;
}

async function dbGetCommentByCommentId(commentId) {
  const comment = await commentsCollection.findOne({ commentId });
  if (!comment) {
    throw new Error("Lookup Failed");
  }
  cleanOutput(comment);
  return comment;
}

async function dbGetCommentsByLinkId(linkId) {
  const result = await commentsCollection.find({ linkId }).sort({ ts: "desc" });
  if (!result) {
    throw new Error("Comments Lookup Failed");
  }
  const comments = await result.toArray();
  comments.forEach(cleanOutput);
  return comments;
}

async function dbUpdateComment(comment) {
  let result;
  if (comment._id) {
    result = await commentsCollection.updateOne(
      { _id: comment._id },
      { $set: comment }
    );
  } else {
    result = await commentsCollection.updateOne(
      { commentId: comment.commentId },
      { $set: comment }
    );
  }
  if (!result || !result.acknowledged) {
    throw new Error("Update Failed");
  }
}

async function dbDeleteComment(commentId) {
  const result = await commentsCollection.deleteOne({ commentId });
  if (!result || !result.acknowledged || result.deletedCount !== 1) {
    throw new Error("Delete Failed");
  }
}

function cleanOutput(comment) {
  delete comment._id;
  delete comment.ts;
}

module.exports = {
  dbCreateComment,
  dbGetCommentByObjectId,
  dbGetCommentByCommentId,
  dbUpdateComment,
  dbDeleteComment,
  dbGetCommentsByLinkId,
};
