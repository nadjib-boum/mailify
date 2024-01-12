const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const spinnerUtil = require("nanospinner");
const { sleep, random} = require("../helpers")


class MessagingUtil {

  constructor (config) {
    this.oauthClient = null;
    this.transport = null;
    this.config = config || {
      time_range: {
        min: 1,
        max: 15
      },
    };
  }

  async #sleep () {
    await sleep(random(this.config.time_range.min, this.config.time_range.max) * 1000);
  }

  async #sendMail (mail_options) {
    return new Promise((resolve, reject) => {
      this.transport?.sendMail(mail_options, (error, result) => {
        if (error) {
          reject (error);
        }
        resolve (result);
      })
    })
  }

  authenticate () {

    const auth_spinner = spinnerUtil.createSpinner("Gmail authentication is being handled...\n").start({ color: "cyan" });

    try {

      this.oauthClient = new google.auth.OAuth2 (process.env.clientId, process.env.clientSecret)

      this.oauthClient.setCredentials({ refresh_token: process.env.refreshToken });

      const accessToken = this.oauthClient.getAccessToken();

      this.transport = nodemailer.createTransport({
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

      auth_spinner.success()
    
    } catch (error) {

      auth_spinner.error();

      throw error;

    }

  }

  async sendMessage(email, message) {

    try {

      const mail_options = {
        from: process.env.user,
        to: email,
        subject: "Question",
        html: message
      }
      
      const result = await this.#sendMail(mail_options);

      await this.#sleep ();
      
      return result;

    } catch (error) {
      
      return Promise.reject(error);

    }
  }

  async close () {
    return;
  }

}

module.exports = {
  MessagingUtil: new MessagingUtil(),
}