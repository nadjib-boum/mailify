const figlet = require("figlet");
const gradient = require('gradient-string');
const inquirer_prompts = require("@inquirer/prompts");
const inquirer_confirm = require("@inquirer/confirm");
const cliProgress = require('cli-progress');


class CLIUtil {

  constructor () {
    this.progress_bar = null;
    this.total_progress = null;
  }

  displayIntro (message) {
    return new Promise((resolve, reject) => {
      figlet(message, function (err, data) {
        if (err) {
          reject(err);
        }
        console.log(gradient.cristal(data));
        console.log ("\n");
        resolve();
      });
    });
  }

  async input (props) {

    const { message, default: defaultAnswer } = props;

    const answer = await inquirer_prompts.input({ message, default: defaultAnswer });

    return answer;

  }

  async confirm (props) {

    const { message, default: defaultAnswer } = props;

    const answer = await inquirer_confirm.confirm({ message, default: defaultAnswer });

    return answer;

  }

  startProgress ({ total_progress }) {

    this.progress_bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);

    this.total_progress = total_progress;

    this.progress_bar.start(100, 0);

  }

  updateProgress (i) {
    this.progress_bar.update((i / this.total_progress) * 100, { speed: "20" });
  }

}

module.exports = {
  CLIUtil: new CLIUtil(),
}