const Router = require("express").Router;
const router = new Router();
const Message = require("../models/message")
const {ensureLoggedIn} = require("../middleware/auth")
const ExpressError = require("../ExpressError")

// NOTE: If you'd like, this router.use portion below will log you in.
// router.use((req, res, next) => {
//     req.user = {
//         username: 'username',
//         to_username: 'user2'
//     };
//     next();
// });


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, async(req, res, next) => {
    try {
        const id = req.params.id
        let username = req.user.username
        let msg = await Message.get(id)
        if (msg.to_user.username !== username && msg.from_user.username !== username) {
            throw new ExpressError("You are not authorized to read this message.", 401);
        }
        return res.json({Message: msg})
    } catch (error) {
        return next(error);
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async(req, res, next) => {
    try {
        let msg = await Message.create({
            from_username: req.user.username,
            to_username: req.user.to_username,
            body: req.body.body
        })
        return res.json({Message: msg})
    } catch (error) {
        return next(error);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async(req, res, next) => {
    try {
        const id = req.params.id
        let msg = await Message.get(id)
        if (msg.to_user.username !== req.user.username) {
            throw new ExpressError("You are not authorized to mark this message as read", 401);
        }
        let message = await Message.markRead(id)
        return res.json({Message: message})
    } catch (error) {
        return next(error);
    }
})


module.exports = router;