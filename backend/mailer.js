import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: `eventifyepic@gmail.com`,
        pass: `ppkv rwqx ychm skco`
    }
});

export const sendOTPEmail = (to,otp) => {
    const mailOptions = {
        from: `eventifyepic@gmail.com`,
        to: to,
        subject: `Change the Password`,
        text: `We received a request to reset your password. Please use the following One Time Password (OTP) to reset your password:\n\n${otp}\n\nIf you did not request a password reset, please ignore this email or contact our support team.\n\nBest regards,\nEpic Eventify`
    };

    transporter.sendMail(mailOptions,(error,info) =>{
        if(error){
            console.log(error);
        }
        else{
            console.log(`Email sent: `+info.response);
        }
    })
};

export default transporter;


