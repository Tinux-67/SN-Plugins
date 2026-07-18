# SN-Plugins

A collection of Standard Notes plugins by Tinux-67.

## 📊 Plugins

### 🔗 Note Graph Visualizer
A visual representation of the relationship between notes and tags. Features:
- **Interactive Graph**: Force-directed layout showing notes and tags as nodes
- **Search**: Real-time search through note titles
- **Filter by Tag**: Filter the graph to show only notes with specific tags
- **Node Details**: Click on any note to see detailed information
- **Statistics**: Shows count of notes, tags, and connections
- **Zoom & Pan**: Navigate the graph with mouse and zoom controls
- **Theme Support**: Fully compatible with Standard Notes themes

## Project Structure

```
SN-Plugins/
├── ext.json                         # Main plugin descriptor
├── package.json                     # Project metadata and scripts
├── tsconfig.json                    # TypeScript configuration
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
├── src/
│   ├── note-graph/                  # Note Graph Visualizer plugin
│   │   ├── index.html               # HTML entry point
│   │   ├── index.ts                 # TypeScript source
│   │   ├── styles.css               # CSS styles
│   │   ├── ext.json                 # Plugin descriptor
│   │   └── package.json             # Plugin package config
│   │   └── tsconfig.json            # TypeScript config
│   ├── index.html                   # Template HTML (deprecated)
│   ├── index.ts                     # Template TS (deprecated)
│   └── styles.css                   # Template CSS (deprecated)
└── dist/                            # Build output (generated)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tinux-67/SN-Plugins.git
   cd SN-Plugins
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

#### Note Graph Visualizer

To develop the Note Graph plugin:

```bash
# Install dependencies
npm install

# Build the note graph plugin
npm run build:note-graph

# Start development server for note graph
npm run start:note-graph
```

Then open `http://localhost:3000/note-graph/` in your browser.

#### All Plugins

```bash
# Build all plugins
npm run build

# Start development server
npm start
```

## 📦 Note Graph Visualizer

### Features

#### Visualization
- **Force-directed graph**: Notes and tags are arranged automatically
- **Color coding**: Notes and tags have different visual styles
- **Interactive**: Drag nodes, zoom, pan
- **Tooltips**: Hover over nodes to see information

#### Filtering & Search
- **Search**: Type in the search box to filter notes by title
- **Tag Filter**: Select a tag to show only related notes
- **Combination**: Use both search and tag filter together

#### Node Details
- Click on any note node to open the detail panel
- Shows: title, UUID, creation date, update date, tags, preview
- Press Escape to close

### Usage

1. **Search**: Start typing in the search box to filter notes
2. **Filter by Tag**: Select a tag from the dropdown to focus on specific tags
3. **Explore**: Hover over nodes to see tooltips with information
4. **Details**: Click on a note to see full details
5. **Navigate**: Use mouse to drag, scroll to zoom, or use zoom controls

### Keyboard Shortcuts
- `Ctrl/Cmd + F`: Focus search box
- `Escape`: Close detail panel

### Screenshot

The graph shows:
- **Circles**: Notes (larger) and tags (smaller)
- **Lines**: Connections between notes and their tags
- **Colors**: Uses Standard Notes theme colors

## 🔧 Configuration

### Plugin Descriptor (ext.json)

Each plugin has its own `ext.json` file. For the Note Graph Visualizer:

```json
{
  "identifier": "dev.tinux-67.note-graph",
  "name": "Note Graph Visualizer",
  "description": "Visual representation of note-tag relationships",
  "content_type": "SN|Component",
  "area": "editor-editor",
  "version": "1.0.0",
  "url": "https://tinux-67.github.io/SN-Plugins/note-graph/",
  "download_url": "https://tinux-67.github.io/SN-Plugins/note-graph/latest.zip",
  "latest_url": "https://tinux-67.github.io/SN-Plugins/note-graph/package.json"
}
```

### Customization

You can customize the graph appearance by modifying `src/note-graph/styles.css`:

```css
/* Change node sizes */
.node.tag circle { r: 8; }
.node.note circle { r: 12; }

/* Change colors */
.node.tag circle { fill: var(--sn-stylekit-neutral-color); }
.node.note circle { fill: var(--sn-stylekit-contrast-background-color); }

/* Change link appearance */
.link { stroke: var(--sn-stylekit-border-color); }
```

## 📤 Deployment

### GitHub Pages (Recommended)

1. Enable GitHub Pages in repository settings
2. Set source to `gh-pages` branch or `/docs` folder
3. Build and push:

```bash
# Build for production
npm run build

# Or build just the note graph
npm run build:note-graph

# Create zip for distribution
npm run package:note-graph
```

4. Upload the `note-graph.zip` to your hosting

### Manual Deployment

1. Build the plugin:
   ```bash
   cd src/note-graph
   npm run build
   ```

2. Host the `dist` folder contents on any web server
3. Update the URLs in `ext.json` to point to your hosting

## 🛠️ Creating New Plugins

To create a new plugin:

1. Create a new folder in `src/` for your plugin
2. Add the following files:
   - `index.html` - Main HTML file
   - `index.ts` - TypeScript entry point
   - `styles.css` - CSS styles
   - `ext.json` - Plugin descriptor
   - `package.json` - Plugin-specific dependencies
   - `tsconfig.json` - TypeScript configuration

3. Update the main `package.json` with build scripts
4. Build and test

## 📚 Standard Notes API

This project uses the [sn-extension-api](https://github.com/nienow/sn-extension-api) for communication with Standard Notes.

### Basic Usage

```typescript
import snApi from 'sn-extension-api';

// Initialize communication
snApi.initialize();

// Subscribe to note updates
snApi.subscribe(() => {
    console.log('Note updated:', snApi.text);
});

// Update note content
snApi.text = 'New content';
```

### Note Structure

Standard Notes stores notes with this structure:

```json
{
  "uuid": "unique-identifier",
  "title": "Note Title",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "content": {
    "text": "Note content",
    "preview_plain": "Preview text",
    "appData": {
      "org.standardnotes.sn": { "locked": false },
      "custom.key": { "tags": ["tag1", "tag2"] }
    }
  }
}
```

## 🎨 Theme Variables

Standard Notes provides CSS variables for theming. Use them in your CSS:

```css
body {
    background-color: var(--sn-stylekit-background-color);
    color: var(--sn-stylekit-foreground-color);
    font-family: var(--sn-stylekit-editor-font-family);
}

button {
    background-color: var(--sn-stylekit-contrast-background-color);
}
```

Common theme variables:
- `--sn-stylekit-background-color`
- `--sn-stylekit-foreground-color`
- `--sn-stylekit-contrast-background-color`
- `--sn-stylekit-border-color`
- `--sn-stylekit-editor-font-family`
- `--sn-stylekit-font-size-editor`
- `--sn-stylekit-neutral-color`

## 🔗 Resources

- [Standard Notes Plugin Guide](https://randombits.dev/standard-notes/creating-extensions)
- [sn-extension-api Documentation](https://github.com/nienow/sn-extension-api)
- [Starter Template](https://github.com/nienow/sn-extension-template)
- [D3.js Documentation](https://d3js.org/) (used for graph visualization)

## 📜 License

MIT

---

**Note**: The Note Graph Visualizer currently uses mock data for development. In production, you would need to implement the actual Standard Notes API integration to fetch real notes and tags. The structure is in place to easily add this integration.
