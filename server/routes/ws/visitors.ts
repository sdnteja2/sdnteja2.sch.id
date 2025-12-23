import { getQuery } from 'ufo'

export default defineWebSocketHandler({
  open(peer) {
    // Get all connected peers with their query params
    const visitors = Array.from(peer.peers.values()).map(p => getQuery(p.websocket.url!))
    // We subscribe to the 'visitors' channel
    peer.subscribe('visitors')
    // We publish the number of connected users to the 'visitors' channel
    peer.publish('visitors', JSON.stringify({ count: peer.peers.size, visitors }))
    // We send the number of connected users to the client
    peer.send(JSON.stringify({ count: peer.peers.size }))
  },
  close(peer) {
    peer.unsubscribe('visitors')
    // Wait 500ms before sending the updated count to the server
    setTimeout(() => {
      const visitors = Array.from(peer.peers.values()).map(p => getQuery(p.websocket.url!))
      peer.publish('visitors', JSON.stringify({ count: peer.peers.size, visitors }))
    }, 500)
  },
})
