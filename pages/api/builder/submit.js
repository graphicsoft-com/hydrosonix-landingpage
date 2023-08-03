import formidable from 'formidable'
import nodemailer from 'nodemailer'

const form = new formidable.IncomingForm()

const formParse = (req) => new Promise((r, j) => form.parse(req, (e, f) => (!e ? r(f) : j(e))))

export default async (req, res) => {
  try {
    const fields = await formParse(req)
    console.log(fields)

    // Define transporter, i.e., service that will send the email
    let transporter = nodemailer.createTransport({
      service: 'gmail', // replace with your email service
      auth: {
        user: 'yourEmail@gmail.com', // replace with your email address
        pass: 'yourPassword' // replace with your email password
      }
    });

    // Define email options
    let mailOptions = {
      from: 'yourEmail@gmail.com', // sender address
      to: 'targetEmail@gmail.com', // list of receivers
      subject: 'Form Submission', // Subject line
      text: JSON.stringify(fields) // plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
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
