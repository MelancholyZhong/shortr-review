const { getHubLinks } = require("../service/linkService");

const express = require("express");
const router = express.Router();

//Here you used the dynamic url for different user, we should try something like this too.
router.get("/:user", async (req, res, next) => {
  try {
    const data = await getHubLinks(req.params.user);
    res.send({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
