require("dotenv").config ();

const { CSVUtil, FileUtil, MessagingUtil, CLIUtil, ContactsUtil } = require("./utils");

main ();

async function main () {

  try {

    await CLIUtil.displayIntro("Mailify");    

    const contacts_path = await CLIUtil.input({ message: "Enter the path of the contacts file:", default: "./data/contacts.csv" });

    const excluded_contacts_path = await CLIUtil.input({ message: "Enter the path of the excluded contacts file:", default: "./data/excluded_contacts.csv" });

    const message_path = await CLIUtil.input({ message: "Enter the path of the contacts file:", default: "./data/message.txt" });  
    
    const accept_duplicate_contacts = await CLIUtil.input({ message: "Do you want to allow duplicate contacts? (y/n)", default: false  });

    const config = {
      contacts_path,
      excluded_contacts_path,
      message_path,
      accept_duplicate_contacts
    }

    const contacts = await CSVUtil.fetch(config.contacts_path, ['email', 'name']);

    const excluded_contacts = await CSVUtil.fetch(config.excluded_contacts_path, ['email', 'name']);

    const prepared_contacts = ContactsUtil.exclude(!config.accept_duplicate_contacts ? ContactsUtil.unduplicate(contacts) : contacts, excluded_contacts);

    const contacts_length = prepared_contacts.length;

    const message = await FileUtil.read(config.message_path);

    MessagingUtil.authenticate();
  
    let i = 0;

    console.log ("[+] Messaging started\n");

    CLIUtil.startProgress ({ total_progress: contacts_length });

    for (const contact of prepared_contacts) {
  
      const { email, name } = contact;
  
      try {
  
        CLIUtil.updateProgress(++i);

        const preparedMessage = ContactsUtil.setTemplate (message, { name });

        await MessagingUtil.sendMessage(email, preparedMessage);

      } catch(err) {
        
        console.log ("❌ Sending Message Failed")

        console.log (err);

      }
  
    }

    MessagingUtil.close();

    console.log ("\n", "[+] Messaging ended.")
  
    process.exit(1);

  } catch (err) {

    console.log ("❌ App Stopped Working")

    console.log (err);

    process.exit(0);

  }

}