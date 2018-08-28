const readline = require('readline');
const {peers} = require('./config.js');

// reference to redline interface
let rl;
/**
 * Function for safely call console.log with readline interface active
 */
function log() {
  if (rl) {
    rl.clearLine();
    rl.close();
    rl = undefined;
  }
  for (let i = 0, len = arguments.length; i < len; i++) {
    console.log(arguments[i]);
  }
  askUser();
}

/*
* Function to get text input from user and send it to other peers
* Like a chat :)
*/
const askUser = async () => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Send message: ', message => {
    // Broadcast to peers
    for (let id in peers) {
      peers[id].conn.write(message);
    }
    rl.close();
    rl = undefined;
    askUser();
  });
};

module.exports = {askUser, log};
