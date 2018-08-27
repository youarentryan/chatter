
const Swarm = require('discovery-swarm');
const getPort = require('get-port');

const askUser = require('./ui');
const { peers, connSeq, myId, config } = require('./config');

/**
 * discovery-swarm library establishes a TCP p2p connection and uses
 * discovery-channel library for peer discovery
 */

const sw = Swarm(config);

(async () => {
  // Choose a random unused port for listening TCP peer connections
  const port = await getPort();

  sw.listen(port);
  console.log('Listening to port: ' + port);

  /**
   * The channel we are connecting to.
   * Peers should discover other peers in this channel
   */
  sw.join('our-fun-channel');

  sw.on('connection', (conn, info) => {
    // Connection id
    const seq = connSeq;

    const peerId = info.id.toString('hex');
    log(`Connected #${seq} to peer: ${peerId}`);

    // Keep alive TCP connection with peer
    if (info.initiator) {
      try {
        conn.setKeepAlive(true, 600);
      } catch (exception) {
        log('exception', exception);
      }
    }

    conn.on('data', data => {
      // Here we handle incomming messages
      log('Received Message from peer ' + peerId, '----> ' + data.toString());
    });

    conn.on('close', () => {
      // Here we handle peer disconnection
      log(`Connection ${seq} closed, peer id: ${peerId}`);
      // If the closing connection is the last connection with the peer, removes the peer
      if (peers[peerId].seq === seq) {
        delete peers[peerId];
      }
    });

    // Save the connection
    if (!peers[peerId]) {
      peers[peerId] = {};
    }
    peers[peerId].conn = conn;
    peers[peerId].seq = seq;
    connSeq++;
  });

  // Read user message from command line
  askUser();
})();
