const nodemailer=require('nodemailer')
require('dotenv').config()

const generateOtp = ()=>{
    return Math.floor(100000+Math.random()*900000).toString()
}

const sendEmail = (email,otp)=>{
    const transporter =  nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASS
        }
    })

    const mailOptions = {
        from:'indianpremiumcoffee@gmail.com',
        to:email,
        subject:'E-mail verification code',
        text:`Your otp for email verification is ${otp}`
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(`Email sent ${info.response}`)
        }
    })
}

const getotp = async (email)=>{
    console.log("getotp");
    console.log(email)
    const otp = await generateOtp();
    sendEmail(email,otp)
    return otp
}
module.exports= getotp;