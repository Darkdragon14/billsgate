const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const { user } = require('../models');

/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a username and password.
 * The strategy parses the username and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(new LocalStrategy(function verify(username, password, cb) {
    user.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.'});
        }
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) { 
                return cb(err); 
            }

            if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            
            return cb(null, user);
        });
    }).catch((err) => {
        console.log("Error:", err);
        return done(null, false, {
            message: 'Incorrect username or password.'
        });
    });
}));

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, username: user.username });
    });
});
  
passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

router.get('/login-success', (req, res, next) => {
    res.send({
        message: 'You successfully logged in.', 
        id: req.session.passport.user.id
    });
});

router.get('/login-failure', (req, res, next) => {
    res.status(403).send('Incorrect username or password.');
});

/* POST /auth/login
 *
 * This route authenticates the user by verifying a username and password.
 *
 * A username and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The username and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * username and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/login-success',
    failureRedirect: '/auth/login-failure',
    failureMessage: true
}));

/* POST /logout
 *
 * This route logs the user out.
 */
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.status(204).send();
    });
});

module.exports = router;