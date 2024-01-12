const nodemailer = require("nodemailer");
const { google } = require("googleapis");

require("dotenv").config();

const oauthClient = new google.auth.OAuth2 (process.env.clientId, process.env.clientSecret);

oauthClient.setCredentials({ refresh_token: process.env.refreshToken });

send_mail ();


function send_mail () {
  
  const accessToken = oauthClient.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAUTH2",
      user: process.env.user,
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      refreshToken: process.env.refreshToken,
      accessToken
    }
  });

  const mail_options = {
    from: process.env.user,
    to: "nadjib.samsung33@gmail.com",
    subject: "testing api title",
    html: `<p style='font-size:15px'>
    Hi Plumbing Biz
    <br />
    <br />
    My name is Nadjib Allah.
    <br>
    <br>
    I help plumbing businesses like yours save more time and money by automating their business tasks and processes.
    <br>
    <br>
    I will automate a bunch of your tasks and processes. If it doesn't save you at least 5 hours per week then you won't pay anything.
    <br />
    <br />
    Examples of services I provide:
    <br />
    <br />
    - Data Entry Automation<br />
    - Accounting Automation<br />
    - Operations Automation<br />
    - Inventory<br />
    - Sales<br />
    - Customer support<br />
    - Marketing<br />
    - Appointment Scheduling<br />
    - E-commerce<br />
    <br />
    I will save you valuable time that you can use it to either grow your business more or you can dedicate it to your personal life.
    <br />
    <br />
    My automation services can also save you money by eliminating the need to pay other workers for these repetitive tasks.
    <br />
    <br />
    If you're interested, please feel free to message me here, and I'll be happy to arrange a meeting appointment.
    <br />
    <br />
    Thank you and best regerds<br />
    Nadjib Allah
    </p>`
  }

  transport.sendMail(mail_options, (error, result) => {
    
    if (error) {
      console.log ("error", error);
      return;
    }

    console.log ("result", result);

  })

}