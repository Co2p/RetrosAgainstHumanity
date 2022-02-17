class PeerInterface {
    constructor(id) {
        this.peer = new Peer();
        this.conn = peer.connect(id);
        this.conn.on('open', () => {
            conn.on('data', function(data) {
                console.log('Received', data);
            });
        });
    }

    send(data) {
        this.conn.send(data);
    }
}