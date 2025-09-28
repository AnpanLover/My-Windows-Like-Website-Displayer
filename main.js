document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('iframe-wrapper');
    const resizer = document.getElementById('resizer-br');
    const handle = document.getElementById('drag-handle');
    // NEW: Get the display element
    const dimensionsDisplay = document.getElementById('dimensions-display');

    let isResizing = false;
    let isDragging = false;
    let initialX, initialY;
    let initialWidth, initialHeight, initialTop, initialLeft;

    // ===================================
    // UTILITY FUNCTION
    // ===================================

    // NEW: Function to update the dimensions display
    function updateDimensionsDisplay() {
        const width = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;
        dimensionsDisplay.textContent = `W: ${width}px, H: ${height}px`;
    }

    function getClientCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }
    
    // ===================================
    // DRAG (MOVE) LOGIC
    // The display does NOT need to be updated during drag, only on resize.
    // ===================================

    function startDrag(e) {
        e.preventDefault(); 
        isDragging = true;
        wrapper.classList.add('dragging'); 

        const coords = getClientCoords(e);
        initialX = coords.x;
        initialY = coords.y;
        
        initialTop = wrapper.offsetTop;
        initialLeft = wrapper.offsetLeft;

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
        
        wrapper.style.left = `${newLeft}px`; 
        wrapper.style.top = `${newTop}px`;
    }

    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        wrapper.classList.remove('dragging'); 

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });


    // ===================================
    // RESIZE LOGIC
    // The display MUST be updated during resize.
    // ===================================

    function startResize(e) {
        e.preventDefault(); 
        
        isResizing = true;
        wrapper.classList.add('resizing'); 

        const coords = getClientCoords(e);
        initialX = coords.x;
        initialY = coords.y;
        
        initialWidth = wrapper.offsetWidth;
        initialHeight = wrapper.offsetHeight;

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
        
        wrapper.style.width = `${Math.max(150, newWidth)}px`; 
        wrapper.style.height = `${Math.max(100, newHeight)}px`; 
        
        // NEW: Update the display while resizing
        updateDimensionsDisplay();
    }

    function stopResize() {
        if (!isResizing) return;
        
        isResizing = false;
        wrapper.classList.remove('resizing'); 

        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', stopResize);
        
        // Final update to the display
        updateDimensionsDisplay();
    }

    resizer.addEventListener('mousedown', startResize);
    resizer.addEventListener('touchstart', startResize, { passive: false });
    
    // NEW: Initial call to display starting dimensions
    updateDimensionsDisplay();
});
