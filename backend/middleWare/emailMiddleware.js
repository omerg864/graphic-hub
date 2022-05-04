import { createTransport } from 'nodemailer';

const sendEmail = async (reciever, subject, text) => {
    console.log(process.env.EMAIL_ADDRESS);
    console.log(process.env.EMAIL_PASSWORD);
    var transporter = createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: reciever,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        return false;
        } else {
        console.log('Email sent: ' + info.response);
        return true;
        }
    });
}

export default sendEmail;