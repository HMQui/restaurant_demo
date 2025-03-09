const bcript = require('bcrypt')

const cloudinary = require('../configs/cloudinary')
const userAccountsModel = require('../models/UserAccounts')
const hashPassword = require('../services/hashPassword')

const userInfo = async (req, res) => {
    const userId = req.userId
    
    try {
        userAccountsModel.findById({ _id: userId })
            .lean()
            .then(user => {                
                if (user) {
                    return res.json({
                        role: user.role,
                        avatar: user.avatar,
                    })
                }
                else {
                    return res.json({
                        error: 1,
                        message: 'User dose not exist'
                    })
                }
            })
            .catch(err => res.status(500).json({ error: 1, message: 'Fail at DataBase' }))
    } catch (error) {
        return res.status.json({ error: 1, message: error })
    }
}

const userInfoFull = async (req, res) => {
    const userId = req.userId
    
    try {
        userAccountsModel.findById(userId)
            .select('-password')
            .lean()
            .then(user => {                
                if (user) {
                    return res.json(user)
                }
                else {
                    return res.json({
                        error: 1,
                        message: 'User dose not exist'
                    })
                }
            })
            .catch(err => res.status(500).json({ error: 1, message: 'Fail at DataBase' }))
    } catch (error) {
        return res.status.json({ error: 1, message: error })
    }
}

const userUpdateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const updateData = req.body.updateData;

        if (!updateData) {
            return res.status(400).json({ error: 1, message: "No update data provided" });
        }

        const allowedFields = ["username", "fullname", "email", "dateOfBirth", "sexual"];

        const filteredUpdate = Object.keys(updateData)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        if (Object.keys(filteredUpdate).length === 0) {
            return res.status(400).json({ error: 1, message: "No valid fields to update" });
        }

        const updatedUser = await userAccountsModel.findByIdAndUpdate(
            userId,
            { $set: filteredUpdate },
            { new: true, select: "-password" }
        ).lean();

        if (!updatedUser) {
            return res.status(404).json({ error: 1, message: "User not found" });
        }

        res.json({ success: 1, message: "Profile updated successfully", updatedUser });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: 1, message: "Internal server error" });
    }
};

const changePassword = async (req, res) => {
    const userId = req.userId
    const currPass = req.body.currPass
    const newPass = req.body.newPass

    try {
        const profile = await userAccountsModel.findById(userId).lean()

        const isMatch = await bcript.compare(currPass, profile.password)

        if (!isMatch) return res.json({ error: 1, message: 'Current Password is incorrect' })
        
        const hashedPassword = await hashPassword(newPass)

        userAccountsModel.updateOne( { _id: userId }, { $set: { password: hashedPassword }})
            .then(() => res.json({ error: 0, message: 'Change Password successfully' }))
            .catch((error) => {
                console.log('Something wrong at changePassword Controller (Database): ' + error);
                return res.status(500).json({ error: 1, message: 'Server error' })
            })
        
    } catch (error) {
        console.error("Error change password: ", error);
        res.status(500).json({ error: 1, message: "Internal server error" });
    }
}

const updateAvatar = async (req, res) => {
    const userId = req.userId;

    if (req.body.isDefault) {
        try {
            await userAccountsModel.updateOne({ _id: userId }, { $set: { avatar: null } });
            return res.json({ error: 0, message: "Set avatar as default successfully" });
        } catch (error) {
            console.log("Error updating avatar to default:", error);
            return res.status(500).json({ error: 1, message: "Avatar cannot be updated to Database." });
        }
    }

    if (!req.file) {
        return res.status(400).json({ error: 1, message: "No file uploaded" });
    }

    const fileName = `avatar_${userId}`;

    try {
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    resource_type: "image",
                    public_id: fileName,
                    folder: "avatars",
                    overwrite: true
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const result = await uploadPromise;

        await userAccountsModel.updateOne({ _id: userId }, { $set: { avatar: result.secure_url } });

        return res.json({ error: 0, secure_url: result.secure_url });
    } catch (error) {
        console.error("Error updating avatar:", error);
        return res.status(500).json({ error: 1, message: "Internal server error" });
    }
};


module.exports = {
    userInfo,
    userInfoFull,
    userUpdateProfile,
    changePassword,
    updateAvatar,
}