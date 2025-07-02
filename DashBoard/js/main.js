// Add drag and drop functionality
function initDragAndDrop() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('csv-file');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
    }
    
    function unhighlight() {
        uploadArea.style.borderColor = '#e9ecef';
        uploadArea.style.backgroundColor = 'transparent';
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            fileInput.files = files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = el.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        el.addEventListener('mouseenter', (e) => {
            const rect = el.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width/2}px`;
            tooltip.style.top = `${rect.bottom + 5}px`;
            tooltip.style.opacity = '1';
        });
        
        el.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// Initialize all event listeners
function initEventListeners() {
    // Range input
    document.getElementById('age-range').addEventListener('input', function() {
        document.getElementById('age-value').textContent = `15 - ${this.value}`;
        updateDashboard();
    });
    
    // File input
    document.getElementById('csv-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const uploadArea = document.getElementById('upload-area');
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success-color); margin-bottom: 1rem;"></i>
                <p>${file.name}</p>
                <small>${(file.size / 1024).toFixed(1)} KB</small>
            `;
            loadData(file);
        }
    });
    
    // Filter controls
    const filterControls = [
        'gender', 'obesity-level', 'family-history',
        'primary-chart', 'x-axis', 'y-axis', 'color-by'
    ];
    
    filterControls.forEach(controlId => {
        document.getElementById(controlId).addEventListener('change', updateDashboard);
    });
    
    // Update button
    document.getElementById('update-visualizations').addEventListener('click', updateDashboard);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initDragAndDrop();
    initTooltips();
    initEventListeners();
    
    // Trigger initial update
    document.getElementById('age-range').dispatchEvent(new Event('input'));
    
    // Add fade-in animations to all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});