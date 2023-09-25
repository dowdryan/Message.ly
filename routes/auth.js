const Router = require("express").Router;
const router = new Router();
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config")
const User = require("../models/user")

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async(req, res, next) => {
    try {
        let {username, password} = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY)
            User.updateLoginTimestamp(username)
            return res.json(`Token: ${token}`)
        }
    } catch (error) {
        return next(error)
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async(req, res, next) => {
    try {
        // const results = await User.register(username, password);
        // return res.json(results)
        let {username} = await User.register(req.body);
        let token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});
    } catch (error) {
        return next(error)
    }
})

module.exports = router;