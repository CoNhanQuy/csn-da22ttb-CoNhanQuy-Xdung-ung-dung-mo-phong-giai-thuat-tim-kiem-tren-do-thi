let rows = 20;
let cols = 20;
let startNode = { r: 5, c: 5 }; 
let endNode = { r: 15, c: 15 }; 

let isRunning = false;     
let isFinished = false;    
let walls = new Set();     

let isMousePressed = false;
let draggingStart = false;
let draggingEnd = false;

// TỐC ĐỘ DUYỆT (Tìm kiếm lan ra) - Để 30ms cho mượt
const SPEED = 30; 

function logStatus(msg) {
    document.getElementById('status').innerText = msg;
}

// === KHỞI TẠO LƯỚI ===
function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.id = `${gridId}-${r}-${c}`;
            
            let className = 'cell';
            const isStart = (r === startNode.r && c === startNode.c);
            const isEnd = (r === endNode.r && c === endNode.c);
            const isWall = walls.has(`${r}-${c}`);

            if (isStart) className += ' start draggable';
            else if (isEnd) className += ' end draggable';
            else if (isWall) className += ' wall';

            cell.className = className;

            if (gridId === 'grid1') {
                cell.onmousedown = (e) => handleMouseDown(r, c, e);
                cell.onmouseenter = () => handleMouseEnter(r, c);
                cell.onmouseup = () => handleMouseUp();
            }

            grid.appendChild(cell);
        }
    }
}

// === XỬ LÝ CHUỘT ===
function handleMouseDown(r, c, e) {
    if (isRunning) return; 
    e.preventDefault();    

    isMousePressed = true;
    
    if (r === startNode.r && c === startNode.c) {
        draggingStart = true;
        walls.delete(`${r}-${c}`); 
    } else if (r === endNode.r && c === endNode.c) {
        draggingEnd = true;
        walls.delete(`${r}-${c}`);
    } else {
        toggleWall(r, c);
    }
}

function handleMouseEnter(r, c) {
    if (!isMousePressed) return;
    if (isRunning) return;

    if (draggingStart) {
        moveNode(r, c, 'start');
    } else if (draggingEnd) {
        moveNode(r, c, 'end');
    } else {
        toggleWall(r, c);
    }
}

function handleMouseUp() {
    isMousePressed = false;
    draggingStart = false;
    draggingEnd = false;
}

function moveNode(r, c, type) {
    if (type === 'start' && (r === endNode.r && c === endNode.c)) return;
    if (type === 'end' && (r === startNode.r && c === startNode.c)) return;

    const oldR = type === 'start' ? startNode.r : endNode.r;
    const oldC = type === 'start' ? startNode.c : endNode.c;
    
    updateVisualCell('grid1', oldR, oldC, walls.has(`${oldR}-${oldC}`) ? 'wall' : '');
    updateVisualCell('grid2', oldR, oldC, walls.has(`${oldR}-${oldC}`) ? 'wall' : '');

    if (type === 'start') { startNode = {r, c}; }
    else { endNode = {r, c}; }

    const cssClass = type + ' draggable';
    updateVisualCell('grid1', r, c, cssClass);
    updateVisualCell('grid2', r, c, cssClass);
}

function toggleWall(r, c) {
    if ((r === startNode.r && c === startNode.c) || (r === endNode.r && c === endNode.c)) return;

    const key = `${r}-${c}`;
    if (walls.has(key)) walls.delete(key);
    else walls.add(key);

    const isWall = walls.has(key);
    const css = isWall ? 'wall' : '';
    
    updateVisualCell('grid1', r, c, css);
    updateVisualCell('grid2', r, c, css);
}

function updateVisualCell(gridId, r, c, type) {
    const cell = document.getElementById(`${gridId}-${r}-${c}`);
    if (!cell) return;
    cell.className = `cell ${type}`;
}

// === THUẬT TOÁN ===

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function startVisualizing(algo) {
    if (isRunning) return;
    await resetAll(false); 
    
    isRunning = true;
    isFinished = false;
    document.getElementById('label1').innerText = algo.toUpperCase() + " Algorithm";
    document.getElementById('box2').classList.add('hidden'); 

    logStatus(`Đang chạy ${algo.toUpperCase()}...`);
    
    await runAlgoOnGrid('grid1', algo);
    
    isRunning = false;
    isFinished = true;
    logStatus(`Hoàn thành ${algo.toUpperCase()}!`);
}

async function startCompare() {
    if (isRunning) return;
    await resetAll(false);
    
    isRunning = true;
    isFinished = false;
    document.getElementById('box2').classList.remove('hidden'); 
    createGrid('grid2'); 

    document.getElementById('label1').innerText = "BFS (Lan rộng)";
    
    logStatus("Đang so sánh BFS và DFS...");

    const p1 = runAlgoOnGrid('grid1', 'bfs');
    const p2 = runAlgoOnGrid('grid2', 'dfs');
    
    await Promise.all([p1, p2]);
    
    isRunning = false;
    isFinished = true;
    logStatus("So sánh hoàn tất!");
}

async function runAlgoOnGrid(gridId, algo) {
    const visitedClass = algo === 'bfs' ? 'visited-bfs' : 'visited-dfs';
    
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    let queue = []; 
    
    queue.push({ r: startNode.r, c: startNode.c });
    visited[startNode.r][startNode.c] = true;

    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    let found = false;

    while (queue.length > 0) {
        let curr;
        if (algo === 'bfs') curr = queue.shift(); 
        else curr = queue.pop();                 

        if (curr.r === endNode.r && curr.c === endNode.c) {
            found = true;
            break;
        }

        if (!(curr.r === startNode.r && curr.c === startNode.c)) {
            const cell = document.getElementById(`${gridId}-${curr.r}-${curr.c}`);
            if (cell) cell.classList.add(visitedClass);
        }

        // --- TỐC ĐỘ DUYỆT TÌM KIẾM ---
        await sleep(SPEED); // Dùng biến SPEED (30ms) cho mượt

        let neighbors = [];
        for (let i = 0; i < 4; i++) {
            neighbors.push({ r: curr.r + dr[i], c: curr.c + dc[i] });
        }
        if (algo === 'dfs') neighbors.reverse(); 

        for (let next of neighbors) {
            if (next.r >= 0 && next.r < rows && next.c >= 0 && next.c < cols) {
                if (!visited[next.r][next.c] && !walls.has(`${next.r}-${next.c}`)) {
                    visited[next.r][next.c] = true;
                    parent[next.r][next.c] = curr;
                    queue.push(next);
                }
            }
        }
    }

    if (found) {
        await drawPath(gridId, parent);
    }
}

async function drawPath(gridId, parent) {
    let path = [];
    let curr = endNode;
    
    while (curr) {
        path.push(curr);
        curr = parent[curr.r][curr.c];
        if (curr && curr.r === startNode.r && curr.c === startNode.c) break;
    }
    path.reverse(); 

    for (let node of path) {
        if ((node.r === endNode.r && node.c === endNode.c)) continue; 
        
        const cell = document.getElementById(`${gridId}-${node.r}-${node.c}`);
        if (cell) cell.classList.add('path');
        
        // --- TỐC ĐỘ VẼ ĐƯỜNG ĐI (ĐÃ CHỈNH 150ms) ---
        await sleep(150); 
    }
}

async function resetAll(clearWalls = true) {
    isRunning = false;
    await sleep(100); 

    if (clearWalls) {
        walls.clear();
        logStatus("Đã xóa sạch!");
    } else {
        logStatus("Đã xóa đường đi (Giữ lại tường).");
    }

    createGrid('grid1');
    createGrid('grid2');
    
    const g1 = document.getElementById('grid1');
    const g2 = document.getElementById('grid2');
    g1.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    g1.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    g2.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    g2.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

function applyMatrix() {
    const input = document.getElementById('matrixInput').value.trim();
    if (!input) { alert("Vui lòng nhập ma trận!"); return; }

    const lines = input.split('\n').filter(line => line.trim() !== "");
    const matrix = lines.map(line => line.trim().split(/\s+/));
    const newRows = matrix.length;
    const newCols = matrix[0].length;

    if (newRows < 2 || newCols < 2) { alert("Ma trận quá nhỏ!"); return; }

    rows = newRows;
    cols = newCols;
    
    startNode = { r: 0, c: 0 };
    endNode = { r: rows - 1, c: cols - 1 };
    
    walls.clear();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === '1') walls.add(`${r}-${c}`);
        }
    }

    const containerSize = 400; 
    let cellSize = Math.floor(containerSize / Math.max(rows, cols));
    
    const g1 = document.getElementById('grid1');
    const g2 = document.getElementById('grid2');
    g1.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    g1.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    g2.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    g2.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    createGrid('grid1');
    createGrid('grid2');
    logStatus(`Đã nạp Ma trận ${rows}x${cols}`);
}

createGrid('grid1');
createGrid('grid2');