const express = require('express');

const {sendMail} = require('../constants/global')
const router = express.Router();

router.post('/sent', (req, res, next)=>{
    console.log("email request came");
    let user = req.body;
    console.log({user});
    sendMail(user, (err, info) => {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({ success: false, error: "Email not sent" });
        } else {
            console.log("Email sent");
            res.status(200);
            res.json({ success: true, data: info });
        }
    });
});

module.exports = router;
