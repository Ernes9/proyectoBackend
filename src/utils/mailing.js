import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "kathryne49@ethereal.email",
      pass: "jynZssf176kwkumMPj",
    },
  });
  
  export default transport;