/**
 * Note Graph Visualizer Plugin
 * 
 * Visualizes the relationship between notes and tags as an interactive graph.
 * Features:
 * - Force-directed graph layout
 * - Search and filter functionality
 * - Interactive node details
 * - Tag-based filtering
 */

import snApi from 'sn-extension-api';

// Types
interface Note {
    uuid: string;
    title: string;
    created_at: string;
    updated_at: string;
    content: {
        text: string;
        preview_plain: string;
        appData?: {
            [key: string]: any;
        };
    };
}

interface GraphNode {
    id: string;
    type: 'note' | 'tag';
    name: string;
    noteData?: Note;
    tagCount?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
}

interface GraphLink {
    source: string;
    target: string;
    type: 'note-tag';
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

// Plugin state
let notes: Note[] = [];
let graphData: GraphData = { nodes: [], links: [] };
let filteredGraphData: GraphData = { nodes: [], links: [] };
let svg: SVGSVGElement | null = null;
let zoom: any = null;
let simulation: any = null;
let tooltip: HTMLDivElement | null = null;
let currentViewMode: 'graph' | 'list' = 'graph';
let selectedNode: GraphNode | null = null;

// DOM elements
let searchInput: HTMLInputElement;
let tagFilterSelect: HTMLSelectElement;
let graphContainer: HTMLDivElement;
let detailPanel: HTMLDivElement;
let noteCountSpan: HTMLSpanElement;
let tagCountSpan: HTMLSpanElement;
let connectionCountSpan: HTMLSpanElement;

// Initialize the plugin
function initializePlugin(): void {
    // Initialize SN API
    snApi.initialize();
    
    // Get DOM elements
    searchInput = document.getElementById('searchInput') as HTMLInputElement;
    tagFilterSelect = document.getElementById('tagFilter') as HTMLSelectElement;
    graphContainer = document.getElementById('graphContainer') as HTMLDivElement;
    detailPanel = document.getElementById('detailPanel') as HTMLDivElement;
    noteCountSpan = document.getElementById('noteCount') as HTMLSpanElement;
    tagCountSpan = document.getElementById('tagCount') as HTMLSpanElement;
    connectionCountSpan = document.getElementById('connectionCount') as HTMLSpanElement;
    
    // Setup event listeners
    setupEventListeners();
    
    // Create tooltip
    createTooltip();
    
    // Subscribe to SN updates
    snApi.subscribe(() => {
        // We don't use the current note directly, we need all notes
        // This subscription is here for when the plugin is active
    });
    
    // Request all notes from Standard Notes
    requestAllNotes();
    
    // Create SVG for graph
    createSVG();
    
    // Setup zoom
    setupZoom();
    
    console.log('Note Graph Visualizer loaded');
}

// Request all notes from Standard Notes
async function requestAllNotes(): Promise<void> {
    try {
        // Use the SN API to get all notes
        // This is a simplified approach - in production, you might need to
        // use the ComponentRelay API or a more comprehensive method
        
        // For now, we'll use a mock approach that can be replaced
        // with actual SN API calls
        showLoading();
        
        // Try to get notes through the API
        // Note: The sn-extension-api might not support getting all notes directly
        // This is a placeholder for the actual implementation
        
        // For demonstration, we'll create mock data
        // In a real implementation, you would use:
        // - SN's ComponentRelay API
        // - Or request notes through the extension API
        
        // Mock data for development
        notes = await generateMockNotes();
        
        // Process notes and build graph
        processNotes();
        
        // Update UI
        updateTagFilter();
        updateGraph();
        updateStats();
        
        hideLoading();
        
    } catch (error) {
        console.error('Error fetching notes:', error);
        hideLoading();
        showError('Failed to load notes. Please refresh.');
    }
}

// Generate mock notes for development (replace with actual SN API calls)
async function generateMockNotes(): Promise<Note[]> {
    // In production, this would be replaced with actual SN API calls
    // For now, return mock data
    return [
        {
            uuid: '1',
            title: 'Project Planning',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-20T14:30:00Z',
            content: {
                text: '# Project Planning\n\nThis is the main project document.',
                preview_plain: 'Project Planning - This is the main project document.',
                appData: {
                    'org.standardnotes.sn': { locked: false },
                    'dev.randombits.my-editor': { tags: ['work', 'planning', 'important'] }
                }
            }
        },
        {
            uuid: '2',
            title: 'Meeting Notes',
            created_at: '2024-01-16T09:00:00Z',
            updated_at: '2024-01-18T11:00:00Z',
            content: {
                text: '# Meeting Notes\n\nDiscussion about the new project.',
                preview_plain: 'Meeting Notes - Discussion about the new project.',
                appData: {
                    'org.standardnotes.sn': { locked: false },
                    'dev.randombits.my-editor': { tags: ['work', 'meeting'] }
                }
            }
        },
        {
            uuid: '3',
            title: 'Personal Goals',
            created_at: '2024-01-10T08:00:00Z',
            updated_at: '2024-01-19T16:00:00Z',
            content: {
                text: '# Personal Goals\n\nMy goals for this year.',
                preview_plain: 'Personal Goals - My goals for this year.',
                appData: {
                    'org.standardnotes.sn': { locked: false },
                    'dev.randombits.my-editor': { tags: ['personal', 'goals'] }
                }
            }
        },
        {
            uuid: '4',
            title: 'Research Notes',
            created_at: '2024-01-17T13:00:00Z',
            updated_at: '2024-01-21T09:30:00Z',
            content: {
                text: '# Research Notes\n\nImportant findings from my research.',
                preview_plain: 'Research Notes - Important findings from my research.',
                appData: {
                    'org.standardnotes.sn': { locked: false },
                    'dev.randombits.my-editor': { tags: ['work', 'research', 'important'] }
                }
            }
        },
        {
            uuid: '5',
            title: 'Ideas',
            created_at: '2024-01-12T11:00:00Z',
            updated_at: '2024-01-22T15:00:00Z',
            content: {
                text: '# Ideas\n\nRandom ideas and thoughts.',
                preview_plain: 'Ideas - Random ideas and thoughts.',
                appData: {
                    'org.standardnotes.sn': { locked: false },
                    'dev.randombits.my-editor': { tags: ['personal', 'ideas'] }
                }
            }
        },
        {
            uuid: '6',
            title: 'Technical Documentation',
            created_at: '2024-01-14T14:00:00Z',
            updated_at: '2024-01-23T10:00:00Z',
            content: {
                text: '# Technical Documentation\n\nAPI documentation and examples.',
                preview_plain: 'Technical Documentation - API documentation and examples.',
                appData: {
                    'org.standardnotes.sn': { locked: false },
                    'dev.randombits.my-editor': { tags: ['work', 'technical', 'documentation'] }
                }
            }
        }
    ];
}

// Process notes and extract tags
function processNotes(): void {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const tagMap: Map<string, { count: number, node: GraphNode }> = new Map();
    
    // Add notes as nodes
    notes.forEach(note => {
        const noteNode: GraphNode = {
            id: `note-${note.uuid}`,
            type: 'note',
            name: note.title || 'Untitled',
            noteData: note
        };
        nodes.push(noteNode);
        
        // Extract tags from appData
        const tags = extractTagsFromNote(note);
        
        // Add tags as nodes and create links
        tags.forEach(tag => {
            const tagId = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
            
            if (!tagMap.has(tagId)) {
                const tagNode: GraphNode = {
                    id: tagId,
                    type: 'tag',
                    name: tag,
                    tagCount: 0
                };
                nodes.push(tagNode);
                tagMap.set(tagId, { count: 0, node: tagNode });
            }
            
            const tagData = tagMap.get(tagId)!;
            tagData.count++;
            tagData.node.tagCount = tagData.count;
            
            // Create link between note and tag
            links.push({
                source: noteNode.id,
                target: tagId,
                type: 'note-tag'
            });
        });
    });
    
    graphData = { nodes, links };
    filteredGraphData = { ...graphData };
}

// Extract tags from a note
function extractTagsFromNote(note: Note): string[] {
    const tags: string[] = [];
    
    // Check appData for tags
    if (note.content?.appData) {
        for (const key in note.content.appData) {
            const data = note.content.appData[key];
            if (data && typeof data === 'object' && data.tags) {
                if (Array.isArray(data.tags)) {
                    tags.push(...data.tags);
                } else if (typeof data.tags === 'string') {
                    tags.push(data.tags);
                }
            }
        }
    }
    
    // Also check for #tags in the text content
    if (note.content?.text) {
        const tagMatches = note.content.text.match(/#(\w+)/g);
        if (tagMatches) {
            tags.push(...tagMatches.map(t => t.substring(1)));
        }
    }
    
    // Remove duplicates and normalize
    return [...new Set(tags.map(t => t.toLowerCase().trim()))]
        .filter(t => t.length > 0);
}

// Create SVG element
function createSVG(): void {
    // Clear existing SVG
    graphContainer.innerHTML = '';
    
    // Create new SVG
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 600');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    graphContainer.appendChild(svg);
    
    // Add zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <button id="zoomIn">+</button>
        <button id="zoomOut">−</button>
        <button id="zoomReset">⟲</button>
    `;
    graphContainer.appendChild(zoomControls);
    
    // Setup zoom control event listeners
    document.getElementById('zoomIn')?.addEventListener('click', () => {
        if (svg) {
            const currentScale = parseFloat(svg.getAttribute('data-scale') || '1');
            svg.setAttribute('data-scale', (currentScale * 1.2).toString());
            applyZoom(currentScale * 1.2);
        }
    });
    
    document.getElementById('zoomOut')?.addEventListener('click', () => {
        if (svg) {
            const currentScale = parseFloat(svg.getAttribute('data-scale') || '1');
            svg.setAttribute('data-scale', (currentScale / 1.2).toString());
            applyZoom(currentScale / 1.2);
        }
    });
    
    document.getElementById('zoomReset')?.addEventListener('click', () => {
        if (svg) {
            svg.setAttribute('data-scale', '1');
            applyZoom(1);
        }
    });
}

// Apply zoom transformation
function applyZoom(scale: number): void {
    if (svg) {
        const g = svg.querySelector('g');
        if (g) {
            g.setAttribute('transform', `translate(400, 300) scale(${scale}) translate(-400, -300)`);
        }
    }
}

// Setup zoom behavior
function setupZoom(): void {
    if (!svg) return;
    
    // Create a group for zooming
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(g);
    
    // Setup D3 zoom
    zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event: any) => {
            g.setAttribute('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Center the view
    svg.call(zoom.transform, d3.zoomIdentity.translate(400, 300));
}

// Create tooltip
function createTooltip(): void {
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
}

// Update the graph visualization
function updateGraph(): void {
    if (!svg) return;
    
    const g = svg.querySelector('g');
    if (!g) return;
    
    // Clear existing graph
    g.innerHTML = '';
    
    // Filter data based on search and tag filter
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTag = tagFilterSelect.value;
    
    // Filter nodes and links
    const filteredNodes = filteredGraphData.nodes.filter(node => {
        const matchesSearch = node.name.toLowerCase().includes(searchTerm);
        const matchesTag = !selectedTag || 
            (node.type === 'tag' && node.id === selectedTag) ||
            (node.type === 'note' && node.noteData && 
             extractTagsFromNote(node.noteData).some(tag => 
                 `tag-${tag.toLowerCase().replace(/\s+/g, '-')}` === selectedTag
             ));
        return matchesSearch && matchesTag;
    });
    
    const filteredLinks = filteredGraphData.links.filter(link => {
        const sourceNode = filteredNodes.find(n => n.id === link.source);
        const targetNode = filteredNodes.find(n => n.id === link.target);
        return sourceNode && targetNode;
    });
    
    // Update filtered data
    filteredGraphData = {
        nodes: filteredNodes,
        links: filteredLinks
    };
    
    // Don't show if no data
    if (filteredNodes.length === 0) {
        showMessage('No notes match your filters');
        return;
    }
    
    // Create force simulation
    simulation = d3.forceSimulation(filteredNodes as any)
        .force('link', d3.forceLink(filteredLinks as any).id((d: any) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(400, 300))
        .force('collision', d3.forceCollide().radius(20))
        .on('tick', ticked);
    
    // Create links
    const link = g.append('g')
        .selectAll('line')
        .data(filteredLinks)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke-width', 1.5);
    
    // Create nodes
    const node = g.append('g')
        .selectAll('.node')
        .data(filteredNodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('id', (d: GraphNode) => `node-${d.id}`)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Add circles to nodes
    node.append('circle')
        .attr('r', (d: GraphNode) => d.type === 'tag' ? 8 : 12)
        .attr('fill', (d: GraphNode) => 
            d.type === 'tag' ? 'var(--sn-stylekit-neutral-color)' : 'var(--sn-stylekit-contrast-background-color)')
        .attr('stroke', 'var(--sn-stylekit-border-color)')
        .attr('stroke-width', 1.5);
    
    // Add text labels
    node.append('text')
        .attr('class', 'node text')
        .text((d: GraphNode) => d.name)
        .attr('dy', (d: GraphNode) => d.type === 'tag' ? 20 : 25)
        .attr('font-size', 11);
    
    // Add hover effects
    node
        .on('mouseover', function(event: MouseEvent, d: GraphNode) {
            if (tooltip) {
                let content = `<h3>${d.name}</h3>`;
                
                if (d.type === 'note' && d.noteData) {
                    content += `<p>Created: ${new Date(d.noteData.created_at).toLocaleDateString()}</p>`;
                    content += `<p>Updated: ${new Date(d.noteData.updated_at).toLocaleDateString()}</p>`;
                    
                    const tags = extractTagsFromNote(d.noteData);
                    if (tags.length > 0) {
                        content += `<div class="tags">Tags: ${tags.join(', ')}</div>`;
                    }
                    
                    if (d.noteData.content?.preview_plain) {
                        content += `<p class="preview">${d.noteData.content.preview_plain.substring(0, 100)}${d.noteData.content.preview_plain.length > 100 ? '...' : ''}</p>`;
                    }
                } else if (d.type === 'tag') {
                    content += `<p>Connected to ${d.tagCount || 0} notes</p>`;
                }
                
                tooltip.innerHTML = content;
                tooltip.style.display = 'block';
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.top = `${event.pageY + 10}px`;
            }
            
            // Highlight connected nodes
            highlightConnectedNodes(d.id);
        })
        .on('mouseout', function() {
            if (tooltip) {
                tooltip.style.display = 'none';
            }
            clearHighlights();
        })
        .on('click', function(event: MouseEvent, d: GraphNode) {
            event.stopPropagation();
            if (d.type === 'note' && d.noteData) {
                showNoteDetails(d.noteData);
            }
        });
    
    // Update stats
    updateStats();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (svg) {
            const width = graphContainer.clientWidth;
            const height = graphContainer.clientHeight;
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            
            if (simulation) {
                simulation.force('center', d3.forceCenter(width / 2, height / 2));
                simulation.alpha(0.1).restart();
            }
        }
    });
    
    // Trigger resize to set initial dimensions
    window.dispatchEvent(new Event('resize'));
}

// Tick function for force simulation
function ticked(this: any): void {
    const g = svg?.querySelector('g');
    if (!g) return;
    
    g.querySelectorAll('.link')?.forEach((link: SVGLineElement) => {
        const source = filteredGraphData.nodes.find(n => n.id === link.getAttribute('data-source'));
        const target = filteredGraphData.nodes.find(n => n.id === link.getAttribute('data-target'));
        
        if (source && target) {
            link.setAttribute('x1', source.x || 0);
            link.setAttribute('y1', source.y || 0);
            link.setAttribute('x2', target.x || 0);
            link.setAttribute('y2', target.y || 0);
        }
    });
    
    g.querySelectorAll('.node')?.forEach((node: SVGElement) => {
        const d = filteredGraphData.nodes.find(n => n.id === node.id.replace('node-', ''));
        if (d && d.x !== undefined && d.y !== undefined) {
            node.setAttribute('transform', `translate(${d.x},${d.y})`);
        }
    });
}

// Drag functions
function dragstarted(event: any, d: GraphNode): void {
    if (!simulation) return;
    simulation.alphaTarget(0.3).restart();
    d.fx = event.x;
    d.fy = event.y;
}

function dragged(event: any, d: GraphNode): void {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event: any, d: GraphNode): void {
    if (!simulation) return;
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Highlight connected nodes
function highlightConnectedNodes(nodeId: string): void {
    const node = filteredGraphData.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Find all connected nodes
    const connectedIds = new Set<string>();
    connectedIds.add(nodeId);
    
    filteredGraphData.links.forEach(link => {
        if (link.source === nodeId) connectedIds.add(link.target);
        if (link.target === nodeId) connectedIds.add(link.source);
    });
    
    // Highlight nodes and links
    document.querySelectorAll('.node').forEach(el => {
        const id = el.id.replace('node-', '');
        if (connectedIds.has(id)) {
            el.classList.add('highlight');
        } else {
            el.classList.add('dimmed');
        }
    });
    
    document.querySelectorAll('.link').forEach(el => {
        const source = el.getAttribute('data-source');
        const target = el.getAttribute('data-target');
        if (connectedIds.has(source!) || connectedIds.has(target!)) {
            el.classList.add('selected');
        } else {
            el.classList.add('dimmed');
        }
    });
}

// Clear highlights
function clearHighlights(): void {
    document.querySelectorAll('.node').forEach(el => {
        el.classList.remove('highlight', 'dimmed');
    });
    document.querySelectorAll('.link').forEach(el => {
        el.classList.remove('selected', 'dimmed');
    });
}

// Show note details
function showNoteDetails(note: Note): void {
    selectedNode = filteredGraphData.nodes.find(n => n.noteData?.uuid === note.uuid) || null;
    
    const detailTitle = document.getElementById('detailNoteTitle');
    const detailUuid = document.getElementById('detailNoteUuid');
    const detailCreated = document.getElementById('detailNoteCreated');
    const detailUpdated = document.getElementById('detailNoteUpdated');
    const detailTags = document.getElementById('detailNoteTags');
    const detailPreview = document.getElementById('detailNotePreview');
    
    if (detailTitle) detailTitle.textContent = note.title || 'Untitled';
    if (detailUuid) detailUuid.textContent = note.uuid;
    if (detailCreated) detailCreated.textContent = new Date(note.created_at).toLocaleString();
    if (detailUpdated) detailUpdated.textContent = new Date(note.updated_at).toLocaleString();
    
    if (detailTags) {
        const tags = extractTagsFromNote(note);
        detailTags.innerHTML = tags.length > 0 
            ? tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')
            : '<span>No tags</span>';
    }
    
    if (detailPreview) {
        detailPreview.textContent = note.content?.preview_plain || note.content?.text?.substring(0, 200) || 'No preview available';
    }
    
    detailPanel.classList.remove('hidden');
}

// Hide note details
function hideNoteDetails(): void {
    detailPanel.classList.add('hidden');
    selectedNode = null;
}

// Update tag filter dropdown
function updateTagFilter(): void {
    const tags = new Set<string>();
    
    notes.forEach(note => {
        extractTagsFromNote(note).forEach(tag => tags.add(tag));
    });
    
    // Update select options
    tagFilterSelect.innerHTML = '<option value="">All Tags</option>';
    
    Array.from(tags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
        option.textContent = tag;
        tagFilterSelect.appendChild(option);
    });
}

// Update statistics
function updateStats(): void {
    const noteCount = filteredGraphData.nodes.filter(n => n.type === 'note').length;
    const tagCount = filteredGraphData.nodes.filter(n => n.type === 'tag').length;
    const connectionCount = filteredGraphData.links.length;
    
    noteCountSpan.textContent = `${noteCount} note${noteCount !== 1 ? 's' : ''}`;
    tagCountSpan.textContent = `${tagCount} tag${tagCount !== 1 ? 's' : ''}`;
    connectionCountSpan.textContent = `${connectionCount} connection${connectionCount !== 1 ? 's' : ''}`;
}

// Show loading indicator
function showLoading(): void {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading notes...';
    graphContainer.appendChild(loading);
}

// Hide loading indicator
function hideLoading(): void {
    const loading = graphContainer.querySelector('.loading');
    if (loading) {
        graphContainer.removeChild(loading);
    }
}

// Show error message
function showError(message: string): void {
    const error = document.createElement('div');
    error.className = 'loading';
    error.textContent = message;
    error.style.color = 'var(--sn-stylekit-contrast-foreground-color)';
    graphContainer.appendChild(error);
}

// Show message
function showMessage(message: string): void {
    const msg = document.createElement('div');
    msg.className = 'loading';
    msg.textContent = message;
    graphContainer.appendChild(msg);
}

// Setup event listeners
function setupEventListeners(): void {
    // Search input
    searchInput.addEventListener('input', () => {
        updateGraph();
    });
    
    // Search clear button
    document.getElementById('searchClear')?.addEventListener('click', () => {
        searchInput.value = '';
        updateGraph();
    });
    
    // Tag filter
    tagFilterSelect.addEventListener('change', () => {
        updateGraph();
    });
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        requestAllNotes();
    });
    
    // Toggle view button
    document.getElementById('toggleView')?.addEventListener('click', () => {
        currentViewMode = currentViewMode === 'graph' ? 'list' : 'graph';
        // For now, just re-render the graph
        updateGraph();
    });
    
    // Close detail panel
    document.getElementById('closeDetail')?.addEventListener('click', hideNoteDetails);
    
    // Click outside to close detail panel
    document.addEventListener('click', (e) => {
        if (detailPanel && !detailPanel.contains(e.target as Node) && 
            !(e.target as HTMLElement).classList.contains('node')) {
            hideNoteDetails();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideNoteDetails();
        }
        if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlugin);
} else {
    initializePlugin();
}

// Export for testing
export { processNotes, extractTagsFromNote, updateGraph };
