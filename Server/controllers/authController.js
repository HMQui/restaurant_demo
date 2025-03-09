const userAccountsModel = require('../models/UserAccounts')
const verifyCodeUserModel = require('../models/VerifyCodeUser')
const hashPassword = require('../services/hashPassword')

const { sendMail } = require('../services/sendMail')
const generateRandomNumber =  require('../services//randomNumber')

const checkLoggedIn = (req, res) => {
    const token = req.cookies.token
    
    if (!token) return res.json({
        loggin: false
    })
    else return res.json({
        loggin: true
    })
}
 
const userCreateOne = async (req, res) => {
    try {
        const { username, email, password, fullname, sexual, dateOfBirth } = req.body.newUser;
        let returnValue = [
            { error: 0, field: 'username', message: 'Success' },
            { error: 0, field: 'email', message: 'Success' }
        ];

        // Check duplicate username
        const existingUsername = await userAccountsModel.findOne({ username: username, provider: 'local' });
        if (existingUsername) {
            returnValue[0] = { error: 1, field: 'username', message: 'Username is duplicated' };
        }

        // Check duplicate email
        const existingEmail = await userAccountsModel.findOne({ email: email, provider: 'local' });
        if (existingEmail) {
            returnValue[1] = { error: 1, field: 'email', message: 'Email is duplicated' };
        }

        if (existingUsername || existingEmail) {
            return res.json(returnValue);
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new userAccountsModel({
            username,
            email,
            password: hashedPassword,
            fullname,
            sexual,
            dateOfBirth,
            provider: 'local',
        });

        await newUser.save();
        return res.json({
            success: true,
            message: 'User created successfully',
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const requestResetPassword = async (req, res) => {
    const userEmail = req.body.email
    
    try {
        if (!userEmail) return res.status(400).json("Server can't get email")

        const user = await userAccountsModel.findOne({ provider: 'local', email: userEmail }).lean()

        if (!user) return res.json({ error: 1, message: "This email hasn't registed as an account!"})

        const secretCode = generateRandomNumber()

        await verifyCodeUserModel.findOneAndUpdate(
            { userId: user._id },
            { email: user.email, secretCode },
            { upsert: true, new: true }
        );
        
        await sendMail(secretCode, "Gentle Restaurant: Code for RESET PASSWORD", userEmail)

        res.json({ error: 0, message: 'Email has been sent' })

    } catch (error) {
        console.error('Error request reset password:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const verifySecretCode = async (req, res) => {
    const email =  req.body.email
    const secretCode = req.body.secretCode

    try {
        if (!email || !secretCode) return res.status(400).json({ error: 1, message: 'Missing email or secret code' })

        const resDatabase = await verifyCodeUserModel.findOne({ email }).lean()

        if (!resDatabase) return res.status(400).json({ error: 1, message: 'Email is not in DB' })

        if(resDatabase.secretCode !== secretCode) return res.json({ error: 1, message: 'Secret code is incorrect' })

        await verifyCodeUserModel.deleteOne({ email })

        res.json({ error: 0, message: 'Successfully!' })
        
    } catch (error) {
        console.error('Error request reset password:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const ResetPassword = async (req, res) => {
    const email = req.body.email
    const newPassword = req.body.password

    try {
        if (!email || !newPassword) return res.status(400).json({ error: 1, message: 'Missing email or password' })
        
        const resDatabase = await userAccountsModel.findOne({ email, provider: 'local' }).lean()

        if (!resDatabase) return res.status(400).json({ error: 1, message: 'Email is not in DB' })

        const hashedPassword = await hashPassword(newPassword)

        await userAccountsModel.updateOne({ provider: 'local', email }, { $set: { password: hashedPassword } })
        
        res.json({ error: 0, message: 'Successfully' })

    } catch (error) {
        console.error('Error request reset password:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const verifyRootPassword = async (req, res) => {
    const { password } = req.body;    

    if (password === process.env.ROOT_PASSWORD) {
        return res.json({ error: 0, message: 'Success' });
    } else {
        return res.json({ error: 1, message: 'Root password is incorrect' });
    }
}

module.exports = {
    checkLoggedIn,
    userCreateOne,
    requestResetPassword,
    verifySecretCode,
    ResetPassword,
    verifyRootPassword,
}
