# ESC Radio Stream Player - Installation Guide

## Overview
The stream player has been successfully converted from HTML to a React/Next.js page at `/stream`.

## Installation Steps

### 1. Install Required Dependencies

Open a terminal in the `fronsite` directory and run:

```bash
npm install pusher-js laravel-echo
```

These packages are required for WebSocket real-time updates.

### 2. File Structure

The new stream player page is located at:
```
fronsite/
  src/
    app/
      stream/
        page.tsx  ← New React stream player component
```

### 3. Access the Stream Player

Once dependencies are installed and the dev server is running:
```bash
npm run dev
```

Visit: **http://localhost:3000/stream**

## Features Implemented

### ✅ Complete Feature Parity
- **Stream Selection**: Dropdown to choose between different radio streams
- **Real-time Metadata**: Artist, title, and album information updates automatically
- **Album Artwork**: Displays album art from the Icecast sync service
- **WebSocket Integration**: Live updates via Laravel Reverb
- **Play/Stop Controls**: Full playback control
- **Listener Count**: Real-time listener statistics
- **Stream Status**: Online/offline indicator
- **Radio Behavior**: Pause/resume jumps to live position

### 🎨 Modern React/Next.js Stack
- **Next.js 15**: Latest framework features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive styling
- **Framer Motion**: Smooth animations
- **React Icons**: Beautiful icon library
- **Dynamic Imports**: Client-side only module loading

### 🎨 Design System

The player follows the existing frontsite design patterns:
- **Fonts**: Poppins & Plus Jakarta Sans (from layout)
- **Colors**: Purple/Indigo gradient theme matching your brand
- **Components**: Consistent with existing page styles
- **Dark Mode Ready**: Uses Tailwind dark mode classes
- **Responsive**: Mobile-first design with max-width 400px container

## Component Structure

```tsx
StreamPage Component
├── State Management
│   ├── streams (list of available streams)
│   ├── selectedStream (currently playing)
│   ├── isPlaying (playback status)
│   ├── isConnected (WebSocket status)
│   └── metadata (real-time song info)
│
├── Hooks
│   ├── useEffect (audio init)
│   ├── useEffect (load streams)
│   ├── useEffect (WebSocket init)
│   └── useCallback (event handlers)
│
├── WebSocket Integration
│   ├── Pusher.js (WebSocket client)
│   ├── Laravel Echo (channel subscriptions)
│   └── Event Listeners (MetadataUpdated, ListenerCountUpdated, StreamStatusChanged)
│
└── UI Sections
    ├── Artwork Display
    ├── Stream Selector
    ├── Now Playing Info
    ├── Play/Stop Controls
    ├── Info Box
    ├── WebSocket Status
    └── Status Bar (online/listeners)
```

## API Integration

### Endpoints Used
- `GET /api/streams` - List all available streams
- `GET /api/streams/{id}` - Get specific stream details

### WebSocket Channels
- `stream.{id}` - Subscribe to stream events
  - `MetadataUpdated` - Song changed
  - `ListenerCountUpdated` - Listener count changed
  - `StreamStatusChanged` - Stream online/offline

## Configuration

Update these constants in `page.tsx` if needed:

```typescript
const API_BASE = "http://localhost";    // Laravel API URL
const WS_HOST = "localhost";             // WebSocket host
const WS_PORT = 6001;                    // Reverb port
const WS_KEY = "kngkrm58yq2mcuirbnkr";  // Reverb app key
```

## Styling Highlights

### Color Scheme
- **Background**: Purple to Indigo gradient (`from-purple-500 via-purple-600 to-indigo-700`)
- **Card**: White with dark mode support
- **Buttons**: 
  - Play: Purple to Indigo gradient
  - Stop: Red gradient
- **Status Indicators**:
  - Connected: Green
  - Disconnected: Red
  - Online: Animated green pulse

### Typography
- **Song Title**: 2xl, bold
- **Artist**: lg, gray-600
- **Album**: sm, gray-500

### Layout
- **Max Width**: 28rem (448px)
- **Border Radius**: 3xl (24px)
- **Shadow**: 2xl for depth
- **Padding**: Consistent 8-unit spacing

## Code Quality

### TypeScript
- Full type safety with interfaces
- Proper null checks
- Type-safe API responses

### React Best Practices
- useCallback for performance
- useRef for audio and WebSocket instances
- Proper cleanup in useEffect
- Conditional rendering with AnimatePresence

### Accessibility
- Semantic HTML
- Alt text for images
- Proper button labeling
- Status indicators with text + icons

## Testing Checklist

After installation, verify:

1. [ ] Page loads at `/stream`
2. [ ] Streams load from API
3. [ ] Default stream selected
4. [ ] Album artwork displays
5. [ ] Play button starts stream
6. [ ] Stop button pauses stream
7. [ ] WebSocket connects (green status)
8. [ ] Metadata updates when song changes
9. [ ] Listener count displays
10. [ ] Stream selector works
11. [ ] Pause/resume jumps to live position
12. [ ] Animations work smoothly
13. [ ] Mobile responsive
14. [ ] Dark mode works (if enabled)

## Troubleshooting

### WebSocket Not Connecting
- Check Reverb is running: `docker ps | grep reverb`
- Verify WS_KEY matches Laravel config
- Check browser console for errors

### No Audio
- Verify Icecast is running on port 8001
- Check stream URL in browser directly
- Look for CORS errors in console

### Metadata Not Updating
- Verify icecast-sync service is running
- Check sync service logs: `docker logs escradio-icecast-sync`
- Ensure songs have ID3 tags with metadata

### Package Installation Issues
If you get PowerShell execution policy errors, use Command Prompt instead:
```cmd
cd C:\Users\bryan\Desktop\Ongoing\ESC_RADIO\fronsite
npm install pusher-js laravel-echo
```

## Next Steps

### Optional Enhancements
1. **Add Volume Control**: Slider for audio volume
2. **Equalizer Visualization**: Canvas-based audio visualizer
3. **Playlist View**: Show upcoming songs
4. **Share Button**: Share current song on social media
5. **Favorites**: Save favorite songs to localStorage
6. **History**: Recently played tracks
7. **Mobile App**: PWA features for mobile
8. **Keyboard Shortcuts**: Space for play/pause, arrows for volume

### Integration Options
1. Add navigation link in main layout header
2. Create landing page with "Listen Live" button
3. Embed mini-player in site footer
4. Create /radio page with multiple players for different streams

## Success! 🎉

Your stream player is now fully migrated to React with:
- Modern Next.js architecture
- Type-safe TypeScript code
- Beautiful Tailwind CSS styling
- Real-time WebSocket updates
- Smooth Framer Motion animations

Visit http://localhost:3000/stream after running `npm install pusher-js laravel-echo` and `npm run dev`!
