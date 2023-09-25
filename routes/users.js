const { Router } = require("express");
const router = new Router();
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth")
const User = require("../models/user")

// NOTE: If you'd like, this router.use portion below will log you in.
// router.use((req, res, next) => {
//     req.user = {
//         username: 'username',
//         to_username: 'user2'
//     };
//     next();
// });


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async(req, res, next) => {
    try {
        const results = await User.all()
        return res.json({results})
    } catch (error) {
        return next(error)
    }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureCorrectUser, async(req, res, next) => {
    try {
        const username = req.params.username;
        const results = await User.get(username)
        return res.json(results.rows)
    } catch (error) {
        return next(error)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async(req, res, next) => {
    try {
        const username = req.params.username;
        const messages = await User.messagesTo(username)
        return res.json(messages.rows)
    } catch (error) {
        return next(error)
    }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureCorrectUser, async(req, res, next) => {
    try {
        const username = req.params.username;
        const messages = await User.messagesFrom(username)
        if (messages.rows.length <= 0) {
            return res.json("No new messages.")
        } else {
            return res.json(messages.rows)
        }
    } catch (error) {
        return next(error)
    }
})


module.exports = router;