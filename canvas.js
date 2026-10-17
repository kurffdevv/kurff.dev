const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const PIXEL_SIZE = 1; 
let isDrawing = false;
let currentButton = -1; 
let lastGridX = null;
let lastGridY = null;
let lastBrushSize = null;

let baseBrushSize = 4; 
const brushSlider = document.getElementById("brushSlider");
const brushInput = document.getElementById("brushInput");
const colourPicker = document.getElementById("colour");
const eraserToggle = document.getElementById("eraserToggle");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const pressureToggle = document.getElementById("pressureToggle");
const pressureImg = document.getElementById("pressureImg");
const eraserImg = document.getElementById("eraserImg");
const bucketToggle = document.getElementById("bucketToggle");
const bucketImg = document.getElementById("bucketImg");

let isEraserActive = false;
let isPressureActive = true;
let isBucketActive = false;
let undoStack = [];
let redoStack = [];
const MAX_HISTORY = 20;

function saveState() {
    if (undoStack.length >= MAX_HISTORY) {
        undoStack.shift(); 
    }
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undo() {
    if (undoStack.length === 0) return;
    
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (redoStack.length >= MAX_HISTORY) {
        redoStack.shift();
    }

    const previousState = undoStack.pop();
    ctx.putImageData(previousState, 0, 0);
}

function redo() {
    if (redoStack.length === 0) return;

    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length >= MAX_HISTORY) {
        undoStack.shift();
    }

    const nextState = redoStack.pop();
    ctx.putImageData(nextState, 0, 0);
}

saveState();

eraserToggle.addEventListener("click", () => {
    isEraserActive = !isEraserActive;
    if (isEraserActive) {
        eraserImg.src = "/images/yeser.png";
    } else {
        eraserImg.src = "/images/noraser.png";
    }
});

pressureToggle.addEventListener("click", () => {
    isPressureActive = !isPressureActive;
    if (isPressureActive) {
        pressureImg.src = "/images/nosure.png";
    } else {
        pressureImg.src = "/images/yessure.png";
    }
});

bucketToggle.addEventListener("click", () => {
    isBucketActive = !isBucketActive;
    if (isBucketActive) {
        bucketImg.src = "/images/yesket.png";
    } else {
        bucketImg.src = "/images/nosket.png";
    }
});

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString();

    const noww = (localISOTime.split('T'));
    const randomStr = Math.random().toString(36).substring(2, 5);

    const link = document.createElement("a"); 

    link.download = `${noww}-${randomStr}-kurff-dev.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
});

colourPicker.addEventListener("input", (e) => {
    canvas.setAttribute("data-color", e.target.value);
    if (isEraserActive) {
        isEraserActive = false;
        eraserImg.src = "/images/noraser.png";
    }
});

brushSlider.addEventListener("input", (e) => {
    let parsedValue = parseInt(e.target.value, 10);
    if (isNaN(parsedValue) || parsedValue < 1) parsedValue = 1;
    if (parsedValue > 200) parsedValue = 200;

    baseBrushSize = parsedValue;
    brushInput.value = baseBrushSize;
});

brushInput.addEventListener("input", (e) => {
    let parsedValue = parseInt(e.target.value, 10);
    if (isNaN(parsedValue) || parsedValue < 1) parsedValue = 1;
    if (parsedValue > 200) parsedValue = 200;

    baseBrushSize = parsedValue;
    brushSlider.value = baseBrushSize;
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

function paintBlock(baseGridX, baseGridY, activeBrushSize) {
    if (activeBrushSize === 1) {
        if (currentButton === 0 && !isEraserActive) {
            ctx.fillStyle = canvas.getAttribute("data-color") || "#FFFFFF";
            ctx.fillRect(baseGridX, baseGridY, 1, 1);
        } else if (currentButton === 1 || currentButton === 2 || (currentButton === 0 && isEraserActive)) {
            ctx.clearRect(baseGridX, baseGridY, 1, 1);
        }
        return;
    }

    const offset = Math.floor(activeBrushSize / 2);
    const startX = baseGridX - offset;
    const startY = baseGridY - offset;

    if (currentButton === 0 && !isEraserActive) {
        ctx.fillStyle = canvas.getAttribute("data-color") || "#FFFFFF";
        ctx.fillRect(startX, startY, activeBrushSize, activeBrushSize);
    } else if (currentButton === 1 || currentButton === 2 || (currentButton === 0 && isEraserActive)) {
        ctx.clearRect(startX, startY, activeBrushSize, activeBrushSize);
    }
}

function floodFill(startX, startY, fillHex, shouldErase) {
    const width = canvas.width;
    const height = canvas.height;
    
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const targetPos = (startY * width + startX) * 4;
    const targetR = data[targetPos];
    const targetG = data[targetPos + 1];
    const targetB = data[targetPos + 2];
    const targetA = data[targetPos + 3];

    let fillR = 0, fillG = 0, fillB = 0, fillA = 0;

    if (!shouldErase) {
        let r = 255, g = 255, b = 255;
        if (fillHex.startsWith("#")) {
            const num = parseInt(fillHex.slice(1), 16);
            r = (num >> 16) & 255;
            g = (num >> 8) & 255;
            b = num & 255;
        }
        fillR = r; fillG = g; fillB = b; fillA = 255;
    }

    if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) return;

    const queue = [startX, startY];
    let head = 0;

    while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];

        const idx = (cy * width + cx) * 4;
        if (data[idx] === targetR && data[idx+1] === targetG && data[idx+2] === targetB && data[idx+3] === targetA) {
            data[idx] = fillR;
            data[idx+1] = fillG;
            data[idx+2] = fillB;
            data[idx+3] = fillA;

            if (cx > 0) { queue.push(cx - 1, cy); }
            if (cx < width - 1) { queue.push(cx + 1, cy); }
            if (cy > 0) { queue.push(cx, cy - 1); }
            if (cy < height - 1) { queue.push(cx, cy + 1); }
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function drawPixel(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const currentGridX = Math.floor(x / PIXEL_SIZE);
    const currentGridY = Math.floor(y / PIXEL_SIZE);

    if (isBucketActive && event.type === "pointerdown") {
        const eraseAction = (currentButton === 1 || currentButton === 2 || (currentButton === 0 && isEraserActive));
        const color = canvas.getAttribute("data-color") || "#FFFFFF";
        floodFill(currentGridX, currentGridY, color, eraseAction);
        return;
    }

    if (isBucketActive) return;

    let currentBrushSize = baseBrushSize;
    if (isPressureActive && event.pointerType === "pen") {
        if (event.pressure === 0) {
            return;
        }
        currentBrushSize = Math.max(1, Math.round(baseBrushSize * event.pressure));
    }

    if (lastGridX === null || lastGridY === null || lastBrushSize === null) {
        paintBlock(currentGridX, currentGridY, currentBrushSize);
    } else {
        let x0 = lastGridX;
        let y0 = lastGridY;
        const x1 = currentGridX;
        const y1 = currentGridY;

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        const totalSteps = Math.max(dx, dy);
        let stepCount = 0;

        while (true) {
            let t = totalSteps === 0 ? 1 : stepCount / totalSteps;
            let interpolatedSize = Math.round(lastBrushSize + (currentBrushSize - lastBrushSize) * t);
            
            paintBlock(x0, y0, interpolatedSize);

            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
            stepCount++;
        }
    }

    lastGridX = currentGridX;
    lastGridY = currentGridY;
    lastBrushSize = currentBrushSize;
}

function clearCanvas(event){
    saveState();
    redoStack = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("pointerdown", (e) => {
    if (!e.isPrimary) return;
    saveState();
    redoStack = []; 
    isDrawing = true;
    currentButton = e.pointerType === "touch" ? 0 : e.button; 
    
    const rect = canvas.getBoundingClientRect();
    lastGridX = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    lastGridY = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    
    if (isPressureActive && e.pointerType === "pen" && e.pressure > 0) {
        lastBrushSize = Math.max(1, Math.round(baseBrushSize * e.pressure));
    } else {
        lastBrushSize = baseBrushSize;
    }
    
    drawPixel(e);
});

canvas.addEventListener("pointermove", (e) => {
    if (!e.isPrimary) return;
    if (isDrawing) {
        e.preventDefault();
    }
    drawPixel(e);
}, { passive: false });

window.addEventListener("pointerup", (e) => {
    if (!e.isPrimary) return;
    isDrawing = false;
    currentButton = -1;
    lastGridX = null;
    lastGridY = null;
    lastBrushSize = null;
});

window.addEventListener("pointercancel", (e) => {
    if (!e.isPrimary) return;
    isDrawing = false;
    currentButton = -1;
    lastGridX = null;
    lastGridY = null;
    lastBrushSize = null;
});

undoButton.addEventListener("click", undo);

redoButton.addEventListener("click", redo);

window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
    }
});
