import transporter from "./mailer.js";

export const sendContactEmail = (formData) => {
    const {fullname, contactno, email, subject, message} = formData;

    const mailOptions = {
        from: 'eventifyepic@gmail.com',
        replyTo: email,
        to: 'eventifyepic@gmail.com',
        subject: `Contact Form Submission: ${subject}`,
        text: `You have a new contact form submission from ${fullname}.\n\nContact No: ${contactno}\n\nMessage:\n${message}`,
    };

    transporter.sendMail(mailOptions, (error,info) => {
        if(error) {
            console.error("error sending email:",error);
        }
        else{
            console.log("email sent:",info.response);
        }
    })
}