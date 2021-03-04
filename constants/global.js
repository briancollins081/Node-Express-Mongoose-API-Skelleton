const fs = require('fs');
const nodemailer = require('nodemailer');

exports.deleteFile = (filePath, next) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            // there was an error
            console.log(err.toString() || `There was an error deleting file: ${filePath}`);
        } else {
            // file deleted
            console.log("DELETE OPERATION ON FILE SUCCESSFUL: ", filePath);
        }
    })
}
//custom error handler
exports.onError = (message, statusCode, errorData, isAsync, next) => {
    const error = new Error(message);
    error.data = errorData == null || !errorData ? [] : errorData.array();

    error.statusCode = statusCode ? statusCode : 500;

    if (isAsync) {
        return next(error);
    }

    throw error;
}

exports.transformFilename = (length) =>{
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/* exports.sendMail = (user, callback) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    const mailOptions = {
        // from: `${user.name}, ${user.email}`,
        from: `${user.name}, ${process.env.EMAIL_FROM_EMAIL}`,
        to: `<${process.env.EMAIL_FROM_EMAIL}>`,
        subject: `Subject: ${user.subject}`,
        text: `${user.body}`,
        // html: `${user.body}`
    };
    transporter.sendMail(mailOptions, callback);
} */
