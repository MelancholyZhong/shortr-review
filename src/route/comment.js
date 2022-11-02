const {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentsForLink,
} = require("../service/commentService");

const express = require("express");
const router = express.Router();

//It is so good that you used next to handle the errors.
router.post("/", async (req, res, next) => {
  try {
    const commentId = await createComment(req.body);
    res.send({
      success: true,
      data: {
        commentId,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:commentId", async (req, res, next) => {
  try {
    const comment = await getComment(req.params.commentId);
    res.send({
      success: true,
      data: comment,
    });
  } catch (e) {
    next(e);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const comment = await updateComment(req.body);
    res.send({
      success: true,
      data: comment,
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:commentId", async (req, res, next) => {
  try {
    await deleteComment(req.params.commentId);
    res.send({
      success: true,
    });
  } catch (e) {
    next(e);
  }
});

//Using the dynamic url is so important in the project.
router.get("/byLinkId/:linkId", async (req, res, next) => {
  try {
    const comments = await getCommentsForLink(req.params.linkId);
    res.send({
      success: true,
      data: comments,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
