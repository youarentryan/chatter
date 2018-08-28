const crypto = require('crypto');
const defaults = require('dat-swarm-defaults');

/**
 * Here we will save our TCP peer connections
 * using the peer id as key: { peer_id: TCP_Connection }
 */
const peers = {};


// Peer Identity, a random hash for identify your peer
const myId = crypto.randomBytes(32);
console.log('Your identity: ' + myId.toString('hex'));

/**
 * Default DNS and DHT servers
 * This servers are used for peer discovery and establishing connection
 */
const config = defaults({
  // peer-id
  id: myId
});

module.exports = { peers, myId, config }
