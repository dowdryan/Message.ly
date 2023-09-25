const express = require("express");
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");
const ExpressError = require("./ExpressError");
const app = express();


// allow both form-encoded and json body parsing.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// allow connections to all routes from any browser.
app.use(cors());

// get auth token for all routes
app.use(authenticateJWT);

// Routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);


// 404 Handler
app.use(function(req, res, next) {
    const error = new ExpressError("Not Found", 404);
    return next(error)
})

// General Error Handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (process.env.NODE_ENV != "test") console.error(err.stack);
    return res.json({
      error: err,
      message: err.message
    });
  });

module.exports = app;