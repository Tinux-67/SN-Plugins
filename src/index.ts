/**
 * Standard Notes Plugin Entry Point
 * 
 * This file initializes the plugin and handles communication with Standard Notes
 * using the sn-extension-api.
 */

import snApi from 'sn-extension-api';

// Initialize the API - call this once to establish communication
snApi.initialize();

// Get references to DOM elements
const editor = document.getElementById('editor') as HTMLTextAreaElement;

// Subscribe to note updates from Standard Notes
snApi.subscribe(() => {
    // Update the editor with the current note content
    if (editor) {
        editor.value = snApi.text || '';
    }
});

// Handle editor input - update the note content in Standard Notes
if (editor) {
    editor.addEventListener('input', (e) => {
        snApi.text = (e.target as HTMLTextAreaElement).value;
    });
    
    // Initial load
    editor.value = snApi.text || '';
}

// Optional: Handle keyboard shortcuts
editor?.addEventListener('keydown', (e) => {
    // Example: Ctrl/Cmd + S to save (though SN auto-saves)
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
            e.preventDefault();
            // snApi.save() - if needed
        }
    }
});

console.log('Tinux-67 SN Plugin loaded successfully');
