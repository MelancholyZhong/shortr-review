const express = require("express");
const app = express();
const port = 3000;

const linkRouter = require("./route/link");
const commentRouter = require("./route/comment");
const loginRouter = require("./route/login");
const redirectRouter = require("./route/redirect");
const hubRouter = require("./route/hub");
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

app.use("/r", redirectRouter);
app.use("/api/link", linkRouter);
app.use("/api/comment", commentRouter);
app.use("/api/login", loginRouter);
app.use("/api/hub", hubRouter);

//Question: this is new to me, is this for error handling when reached a not defined route?
app.use((err, req, res, next) => {
  console.error(err);
  res.send({
    success: false,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
