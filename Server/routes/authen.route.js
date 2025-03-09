const passport = require('../configs/passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken')
require('dotenv').config();

const authController = require('../controllers/authController')

// authen with GOOGLE
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }), 
    (req, res) => {
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_URL}/login`);
        }
        const token = jwt.sign(
            { id: req.user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL}/login-success`)
    }
);

// authen with FACEBOOK
router.get('/facebook',
    passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' ,session: false }),
    function(req, res) {
        
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_URL}/login`);
        }
        const token = jwt.sign(
            { id: req.user.id }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL}/login-success`)
});

// authen with Local
router.post('/local', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (user) {
            // Generate JWT token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Set httpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }
        return res.json({ error: user ? 0 : 1, message: user ? 'Login successful' : 'Username or password is incorrect' });
    })(req, res, next);
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/", httpOnly: true, secure: true, sameSite: "Strict" });
    res.redirect(`${process.env.CLIENT_URL}/`)
});

// Check logged in for client
router.get('/check', authController.checkLoggedIn)

// create a new user [POST] /register
router.post('/register', authController.userCreateOne)

// request reset password [POST] /request-reset-password
router.post('/request-reset-password', authController.requestResetPassword)

// check verify secret code for reset password [POST] /verify-secret-code
router.post('/verify-secret-code', authController.verifySecretCode)

// reset password [POST] /reset-password
router.post('/reset-password', authController.ResetPassword)

// verify root password [POST] /verify-root-password
router.post('/verify-root-password', authController.verifyRootPassword)

module.exports = router;
