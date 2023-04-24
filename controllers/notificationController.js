import { createTransport } from "nodemailer";
import twilio from "twilio";

const accountSid = "ACc2506fc936f3cdad42ee0869c1e940b5";
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const TEST_MAIL = "gabo.ramirez0811@gmail.com";
const PASS = "nhlaxgvcdovtziyf";
const PHONENum = "+59896989892";

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: TEST_MAIL,
    pass: PASS,
  },
});

const sendMailRegister = async ( {username, direccion}) => {
    let mailOptions = {
        from: "Servidor Nodejs",
        to: "gabrielramirezacosta@hotmail.com",
        subject: "nuevo registro",
        html: `<h1 style="color: blue;"> Nuevo Usuario Registrado</h1>
            <p><strong>Username: </strong>${username}</p>
            <p><strong>Address: </strong>${direccion}</p></p>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info)
} 

const sendSMSMailCheckout = async ( username, cart ) => {
    let mailOptions = {
        from: "Servidor Nodejs",
        to: "gabrielramirezacosta@hotmail.com",
        subject: "nuevo pedido de " + username,
        html: `<h1 style="color: blue;"> Pedido realizado: </h1>
                <p>${cart[0]}</p>
                `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info)

    const sms = await client.messages.create({
        body: "Su pedido ha sido recibido y se encuentra en proceso",
        from: "+15674122870",
        to: PHONENum,
      });
      const whatsapp = await client.messages.create({
        body: "nuevo pedido de " + username,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+59896989892",
      });
} 

export default {sendSMSMailCheckout, sendMailRegister}

