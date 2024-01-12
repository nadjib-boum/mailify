const { exclude, unduplicate } = require("../helpers")


class ContactsUtil {

  #serialize (contacts) {
    return contacts.map((c) => JSON.stringify(c))
  }

  #unserialize (contacts) {
    return contacts.map((c) => JSON.parse(c))
  }

  unduplicate (contacts) {
    return this.#unserialize(unduplicate(this.#serialize(contacts)));
  }

  exclude (contacts, execluded) {
    return this.#unserialize(exclude(this.#serialize(contacts), this.#serialize(execluded)))
  }

  setTemplate (message, params) {
    let preparedMessage = message;
    for (const [ k, v ] of Object.entries(params)) {
      preparedMessage = preparedMessage.replaceAll(`{${k}}`, v)
    }
    return preparedMessage;
  }

}

module.exports = {
  ContactsUtil: new ContactsUtil()
}