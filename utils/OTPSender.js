const nodemailer=require('nodemailer')

module.exports.OTPSender = (email, otp) => {
    // const {subject,message}=req.body;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "verkumar8@gmail.com",
            pass: "ibswzbeyudtunslo"
        }
    })
    var mailOptions = {
        from: "INSTAGRAM Clone",
        to: email,
        subject: "Reset Password OTP",
        text: `Do not share this Reset Password OTP :${otp}`
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            res.json({
                message: "OTP sent successfully",
                success: true
            })
           
        }
    })
}
