document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const wrapper = document.getElementById('iframe-wrapper');
    const resizer = document.getElementById('resizer-br');
    const handle = document.getElementById('drag-handle');
    const dimensionsDisplay = document.getElementById('dimensions-display');
    
    // URL Bar Elements
    const urlInput = document.getElementById('url-input');
    const goButton = document.getElementById('go-button');
    const mainIframe = document.getElementById('main-iframe'); 
    
    // Bottom Control Elements
    const setWidthInput = document.getElementById('set-width');
    const setHeightInput = document.getElementById('set-height');
    const setSizeButton = document.getElementById('set-size-button');

    // --- State Variables and Constants ---
    let isResizing = false;
    let isDragging = false;
    let initialX, initialY;
    let initialWidth, initialHeight, initialTop, initialLeft;
    
    const MIN_WIDTH = 150;
    const MIN_HEIGHT = 100;


    // =================================================================
    // 1. UTILITY FUNCTIONS
    // =================================================================

    // Helper to get touch or mouse coordinates
    function getClientCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    // Updates the internal status bar and external inputs
    function updateDimensionsDisplay() {
        const width = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;
        
        // Update the status bar inside the window
        dimensionsDisplay.textContent = `W: ${width}px, H: ${height}px`;

        // Update the external inputs
        setWidthInput.value = width;
        setHeightInput.value = height;
    }


    // =================================================================
    // 2. DRAG (MOVE) LOGIC
    // =================================================================

    function startDrag(e) {
        e.preventDefault(); 
        isDragging = true;
        wrapper.classList.add('dragging'); 

        const coords = getClientCoords(e);
        initialX = coords.x;
        initialY = coords.y;
        
        // Get initial position for movement calculation
        initialTop = wrapper.offsetTop;
        initialLeft = wrapper.offsetLeft;

        // Attach listeners to the document
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag, { passive: false }); 
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault(); 

        const coords = getClientCoords(e);
        
        const deltaX = coords.x - initialX;
        const deltaY = coords.y - initialY;

        const newLeft = initialLeft + deltaX;
        const newTop = initialTop + deltaY;
        
        // Apply new position
        wrapper.style.left = `${newLeft}px`; 
        wrapper.style.top = `${newTop}px`;
    }

    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        wrapper.classList.remove('dragging'); 

        // Remove event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }

    // Attach drag listeners to the handle
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });


    // =================================================================
    // 3. RESIZE LOGIC
    // =================================================================

    function startResize(e) {
        e.preventDefault(); 
        isResizing = true;
        wrapper.classList.add('resizing'); 

        const coords = getClientCoords(e);
        initialX = coords.x;
        initialY = coords.y;
        
        // Get initial dimensions for resizing
        initialWidth = wrapper.offsetWidth;
        initialHeight = wrapper.offsetHeight;

        // Attach listeners to the document
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchmove', resize, { passive: false }); 
        document.addEventListener('touchend', stopResize);
    }

    function resize(e) {
        if (!isResizing) return;
        
        e.preventDefault(); 

        const coords = getClientCoords(e);
        
        const deltaX = coords.x - initialX;
        const deltaY = coords.y - initialY;

        const newWidth = initialWidth + deltaX;
        const newHeight = initialHeight + deltaY;
        
        // Apply the new dimensions, enforcing a minimum size
        wrapper.style.width = `${Math.max(MIN_WIDTH, newWidth)}px`; 
        wrapper.style.height = `${Math.max(MIN_HEIGHT, newHeight)}px`; 
        
        // Update the display and external inputs
        updateDimensionsDisplay();
    }

    function stopResize() {
        if (!isResizing) return;
        
        isResizing = false;
        wrapper.classList.remove('resizing'); 

        // Remove event listeners
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', stopResize);
        
        // Final update to sync all displays/inputs
        updateDimensionsDisplay();
    }

    // Attach resize listeners to the resizer handle
    resizer.addEventListener('mousedown', startResize);
    resizer.addEventListener('touchstart', startResize, { passive: false });


    // =================================================================
    // 4. URL/BROWSER LOGIC
    // =================================================================

    function loadUrl() {
        let url = urlInput.value.trim();
        
        if (!url) {
            alert("Please enter a URL.");
            return;
        }

        // Simple validation/correction for common protocols
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        mainIframe.src = url;
    }

    // Attach event listeners for the new Go button and Enter key
    goButton.addEventListener('click', loadUrl);
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            loadUrl();
        }
    });


    // =================================================================
    // 5. EXTERNAL SIZE CONTROL LOGIC
    // =================================================================
    
    function setWrapperSize() {
        // Read values from the inputs
        let newWidth = parseInt(setWidthInput.value);
        let newHeight = parseInt(setHeightInput.value);
        
        // Enforce minimum size
        newWidth = Math.max(MIN_WIDTH, newWidth);
        newHeight = Math.max(MIN_HEIGHT, newHeight);

        // Apply size to the wrapper
        wrapper.style.width = `${newWidth}px`;
        wrapper.style.height = `${newHeight}px`;

        // Update the display bar and inputs to reflect the final applied size
        updateDimensionsDisplay();
    }

    // Attach Set Size listener
    setSizeButton.addEventListener('click', setWrapperSize);
    
    // Optional: Allow setting size by pressing Enter in input fields
    setWidthInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') setWrapperSize();
    });
    setHeightInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') setWrapperSize();
    });


    // =================================================================
    // 6. INITIALIZATION
    // =================================================================

    // Set the initial size based on the values in the input fields (600x400 by default) 
    // and syncs the internal status bar.
    setWrapperSize(); 
});
