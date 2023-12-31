const otp = require("../model/OtpSchema.js")
const User = require("../model/userSchema.js")
const jwt = require('jsonwebtoken');
const { OTPSender } = require("../utils/OTPSender.js");

require('dotenv').config();

module.exports.auth = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.json({
            message: "Token Not Found",
            success: false
        })
    } else {

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            req.user.password = undefined;
            console.log(req.user.user);
            next();

        } catch (error) {
            console.log(error, "Error in Auth ");
            return res
                .json({
                    success: false,
                    message: "Session expired"

                })
        }
    }

}

module.exports.OTPauth = async (req, res) => {
    const { token, email } = req.body;
    const code = Math.floor(Math.random() * 10000 + 1);

    try {
        if (token) {
            var payload = await jwt.verify(token, process.env.JWT_SECRET)
            req.user = payload;
            req.user.password = undefined;
        }
        const Userexist = await User.findOne({ email: email || payload.user.email })
        if (Userexist) {
            const exist = await otp.find({ email: email || payload.user.email })
            if (exist) {
                await otp.findOneAndUpdate({ email: email || payload.user.email }, { code });
                OTPSender(email || payload.user.email, code);
                res.json({
                    success: true,
                    message: "OTP sent successfully"
                })

            } else {
                await otp.create({ email: email || payload.user.email, code, expiresIn: new Date().getTime() + 300 * 1000 });
                OTPSender(email || payload.user.email, code);
                res.json({
                    success: true,
                    message: "OTP sent successfully"
                })
            }
        } else {
            res.json({
                success: false,
                message: "User Not exist Please signUp first"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error
        })
    }

}
