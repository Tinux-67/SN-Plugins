# SN-Plugins

A collection of Standard Notes plugins by Tinux-67.

## Project Structure

```
SN-Plugins/
├── ext.json                 # Plugin descriptor for Standard Notes
├── package.json             # Project metadata and scripts
├── tsconfig.json            # TypeScript configuration
├── .gitignore               # Git ignore rules
├── src/
│   ├── index.html           # Main HTML entry point
│   ├── index.ts             # TypeScript entry point
│   └── styles.css           # CSS with SN theme support
└── dist/                    # Build output (generated)
```

## Getting Started

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

- Build the project:
  ```bash
  npm run build
  ```

- Start a development server:
  ```bash
  npm start
  ```

- Watch for changes:
  ```bash
  npm run watch
  ```

### Building for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Create a zip package for distribution:
   ```bash
   npm run package
   ```

This will create a `latest.zip` file in the project root.

## Plugin Descriptor (ext.json)

The `ext.json` file contains metadata about your plugin that Standard Notes uses to install and identify it:

```json
{
  "identifier": "dev.tinux-67.sn-plugins",
  "name": "Tinux-67 Plugins",
  "description": "A collection of Standard Notes plugins by Tinux-67",
  "content_type": "SN|Component",
  "area": "editor-editor",
  "version": "0.1.0",
  "url": "https://tinux-67.github.io/SN-Plugins/",
  "download_url": "https://tinux-67.github.io/SN-Plugins/latest.zip",
  "latest_url": "https://tinux-67.github.io/SN-Plugins/package.json"
}
```

## Deploying

### GitHub Pages (Recommended)

1. Enable GitHub Pages in your repository settings
2. Set the source to the `dist` folder or `gh-pages` branch
3. Update the URLs in `ext.json` to point to your GitHub Pages URL

### Manual Deployment

1. Build the project: `npm run package`
2. Host the contents of the `dist` folder on any web server
3. Update the URLs in `ext.json` accordingly

## Creating New Plugins

To create a new plugin:

1. Create a new folder in `src` for your plugin
2. Add your HTML, TypeScript, and CSS files
3. Update the `ext.json` with your plugin's metadata
4. Build and test

## Standard Notes API

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

### Available Properties

- `snApi.text` - The note content (string)
- `snApi.title` - The note title (string)
- `snApi.uuid` - The note UUID (string)
- `snApi.created_at` - Creation timestamp (string)
- `snApi.updated_at` - Last update timestamp (string)

### Theme Variables

Standard Notes provides CSS variables for theming. Import them in your CSS:

```css
@import 'sn-extension-api/dist/sn.min.css';

body {
    background-color: var(--sn-stylekit-background-color);
    color: var(--sn-stylekit-foreground-color);
    font-family: var(--sn-stylekit-editor-font-family);
}
```

Common theme variables:
- `--sn-stylekit-background-color`
- `--sn-stylekit-foreground-color`
- `--sn-stylekit-contrast-background-color`
- `--sn-stylekit-border-color`
- `--sn-stylekit-editor-font-family`
- `--sn-stylekit-font-size-editor`

## Resources

- [Standard Notes Plugin Guide](https://randombits.dev/standard-notes/creating-extensions)
- [sn-extension-api Documentation](https://github.com/nienow/sn-extension-api)
- [Starter Template](https://github.com/nienow/sn-extension-template)

## License

MIT
