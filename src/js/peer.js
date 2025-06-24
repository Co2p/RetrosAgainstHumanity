import Peer from "peerjs";
import { getRandomAnimalName } from "./util";

export class PeerInterface {
    constructor(id) {
        this.peer = new Peer();
        this.conn = this.peer.connect(id);
        this.conn.on('open', () => {
            this.conn.on('data', (data) => {
                console.log('Received', data);
            });
        });
    }

    send(data) {
        this.conn.send(data);
    }
}

export class P2PManager {
    constructor(urlParamsHandler) {
        this.peer = null;
        this.connections = new Map();
        this.username = getRandomAnimalName();
        this.roomId = null;
        this.isHost = false;
        this.eventHandlers = new Map();
        this.urlParamsHandler = urlParamsHandler;
        
        this.initialize();
    }

    initialize() {
        try {
            this.peer = new Peer();
            
            this.peer.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                this.trigger('peerReady', { id, username: this.username });
                
                // Check if there's a room ID in the URL and try to join
                const roomId = this.urlParamsHandler.getRoomId();
                if (roomId) {
                    this.joinRoom(roomId);
                }
            });

            this.peer.on('connection', (conn) => {
                this.handleIncomingConnection(conn);
            });

            this.peer.on('error', (err) => {
                console.error('Peer error:', err);
                this.trigger('error', err);
            });
        } catch (error) {
            console.error('Failed to initialize P2P:', error);
        }
    }

    createRoom() {
        if (!this.peer) return null;
        
        // Use the peer ID as the room ID for simplicity
        const roomId = this.peer.id;
        this.roomId = roomId;
        this.isHost = true;
        this.urlParamsHandler.setRoomId(roomId);
        
        this.trigger('roomCreated', { roomId });
        return roomId;
    }

    joinRoom(roomId) {
        if (!this.peer || !roomId) return;
        
        this.roomId = roomId;
        this.isHost = false;
        this.urlParamsHandler.setRoomId(roomId);
        
        // Connect to the room host
        this.connectToPeer(roomId);
        
        this.trigger('roomJoined', { roomId });
    }

    handleIncomingConnection(conn) {
        console.log('Incoming connection from:', conn.peer);
        
        conn.on('open', () => {
            this.connections.set(conn.peer, {
                conn: conn,
                username: null
            });
            
            // Send our username to the new peer
            conn.send({
                type: 'userInfo',
                username: this.username,
                peerId: this.peer.id
            });
            
            this.trigger('peerConnected', { peerId: conn.peer });
        });

        conn.on('data', (data) => {
            this.handleMessage(data, conn.peer);
        });

        conn.on('close', () => {
            this.connections.delete(conn.peer);
            this.trigger('peerDisconnected', { peerId: conn.peer });
        });
    }

    connectToPeer(peerId) {
        if (this.connections.has(peerId)) {
            console.log('Already connected to peer:', peerId);
            return;
        }

        if (!this.peer || this.peer.destroyed) {
            console.error('Peer not ready for connections');
            this.trigger('error', { message: 'Peer not ready for connections' });
            return;
        }

        try {
            const conn = this.peer.connect(peerId);
            
            conn.on('open', () => {
                this.connections.set(peerId, {
                    conn: conn,
                    username: null
                });
                
                // Send our username
                conn.send({
                    type: 'userInfo',
                    username: this.username,
                    peerId: this.peer.id
                });
                
                this.trigger('peerConnected', { peerId });
            });

            conn.on('data', (data) => {
                this.handleMessage(data, peerId);
            });

            conn.on('close', () => {
                this.connections.delete(peerId);
                this.trigger('peerDisconnected', { peerId });
            });

            conn.on('error', (err) => {
                console.error('Connection error with peer', peerId, ':', err);
                this.connections.delete(peerId);
                this.trigger('connectionError', { peerId, error: err });
            });
        } catch (error) {
            console.error('Failed to connect to peer:', error);
            this.trigger('connectionError', { peerId, error });
        }
    }

    handleMessage(data, fromPeerId) {
        console.log('Received message:', data, 'from:', fromPeerId);
        
        switch (data.type) {
            case 'userInfo':
                const connection = this.connections.get(fromPeerId);
                if (connection) {
                    connection.username = data.username;
                    this.trigger('userInfoReceived', { 
                        peerId: fromPeerId, 
                        username: data.username 
                    });
                }
                break;
                
            case 'cardFlip':
                this.trigger('cardFlip', { 
                    fromPeerId, 
                    fromUsername: this.connections.get(fromPeerId)?.username,
                    cardData: data.cardData 
                });
                break;
                
            case 'cardDraw':
                this.trigger('cardDraw', { 
                    fromPeerId, 
                    fromUsername: this.connections.get(fromPeerId)?.username,
                    cardData: data.cardData 
                });
                break;
        }
    }

    broadcast(message) {
        let sentCount = 0;
        this.connections.forEach((connection, peerId) => {
            if (connection.conn && connection.conn.open) {
                try {
                    connection.conn.send(message);
                    sentCount++;
                } catch (error) {
                    console.error('Failed to send message to peer', peerId, ':', error);
                    // Remove broken connection
                    this.connections.delete(peerId);
                    this.trigger('peerDisconnected', { peerId });
                }
            }
        });
        return sentCount;
    }

    broadcastCardFlip(cardData) {
        this.broadcast({
            type: 'cardFlip',
            cardData: cardData,
            timestamp: Date.now()
        });
    }

    broadcastCardDraw(cardData) {
        this.broadcast({
            type: 'cardDraw',
            cardData: cardData,
            timestamp: Date.now()
        });
    }

    getConnectedUsers() {
        const users = [];
        this.connections.forEach((connection, peerId) => {
            if (connection.username) {
                users.push({
                    peerId: peerId,
                    username: connection.username
                });
            }
        });
        return users;
    }

    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    trigger(event, data = {}) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error('Error in event handler:', error);
                }
            });
        }
    }

    getPeerId() {
        return this.peer ? this.peer.id : null;
    }

    getUsername() {
        return this.username;
    }

    isConnected() {
        return this.connections.size > 0;
    }

    disconnect() {
        this.connections.forEach((connection) => {
            if (connection.conn) {
                connection.conn.close();
            }
        });
        this.connections.clear();
        
        if (this.peer) {
            this.peer.destroy();
        }
    }
}