import formidable from 'formidable'
import nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
const form = new formidable.IncomingForm()

const mailgunAuth = {
  auth: {
    api_key: "key-135020a4312b98bd9496669f8a4260b0",
    domain: 'https://api.mailgun.net/v3/sandboxf38ed9710da047d3aa4c18897f86da43.mailgun.org/messages'
  }
}

const formParse = (req) => new Promise((r, j) => form.parse(req, (e, f) => (!e ? r(f) : j(e))))
export default async (req, res) => {
  try {
    const fields = await formParse(req)
    console.log(fields)

    const sendTo = "info@tnano.com"; //for production send to 'info@tnano.com' for development send to 'dev@graphicsoft.com'
    // Define transporter, i.e., service that will send the email
    const smtpTransport = nodemailer.createTransport(mailgun(mailgunAuth));
    // Define email options
    let mailOptions = {
      from: 'info@hydrosonix.com', // sender address
      to: sendTo, // list of receivers
      subject: 'Form Submission', // Subject line
      text: JSON.stringify(fields) // plain text body
    };

    // Send email
    smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({ message: 'Form Submitted and Email Sent' })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong' })
  }
}

export const config = { api: { bodyParser: false } }
