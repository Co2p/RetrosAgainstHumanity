# P2P Sync Feature Guide

## Overview
The Retros Against Humanity app now supports decentralized peer-to-peer (P2P) synchronization, allowing multiple users to share a card session in real-time without requiring a server.

## Key Features
- **Random Animal Usernames**: Each user gets a unique animal name (Cat, Dog, Unicorn, etc.)
- **Real-time Card Sync**: Card flips are instantly synchronized across all connected users
- **Room-based Connections**: Easy room creation and sharing via URLs
- **Serverless Architecture**: Direct browser-to-browser connections using WebRTC

## How to Use

### 1. Enable P2P Sync
- Check the "Sync!" checkbox in the top navigation bar
- Your animal username and peer ID will be displayed

### 2. Create a Room (Host)
- Click the "Create Room" button
- Your room ID will be displayed
- Click "Copy Room Link" to share the URL with others

### 3. Join a Room (Guest)
- Visit a shared room URL, OR
- Enter the room ID in the connection field and click "Connect"

### 4. Sync Cards
- Draw and flip cards as normal
- All connected users will see your actions in real-time
- Notifications will appear when others perform actions

## Technical Details

### Architecture
- Uses **PeerJS** library for WebRTC connections
- **Decentralized**: No central server required
- **Event-driven**: Card actions broadcast via custom events

### Connection Types
- **Room-based**: Multiple users connect via shared room ID
- **Direct peer**: Connect directly using peer ID

### Supported Actions
- Card flips (synchronized instantly)
- Card draws (notification to peers)
- Connection status updates

## Troubleshooting

### Common Issues
1. **Connection Failed**: Check if both users have enabled P2P sync
2. **Cards Out of Sync**: Users may have drawn different cards before connecting
3. **No Peer ID**: Wait a moment for the PeerJS connection to initialize

### Error Messages
- **"P2P Error: Connection failed"**: Network or firewall blocking WebRTC
- **"Failed to connect to peer"**: Invalid peer ID or peer offline
- **"Card flipped (not visible locally)"**: Card exists on peer but not locally

## Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support  
- Safari: Full support (iOS 11+)
- Edge: Full support

## Privacy & Security
- All connections are direct peer-to-peer
- No data passes through external servers (except initial peer discovery)
- Room IDs are temporary and not stored permanently

## Limitations
- Maximum ~6-8 connected peers recommended for optimal performance
- Requires modern browser with WebRTC support
- May not work through some corporate firewalls/proxies