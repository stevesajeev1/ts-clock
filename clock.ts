// Grid size parameters
const GRID_DIM = 700;
const GRID_SIZE = 45;
if (GRID_SIZE % 2 == 0) throw new Error("`GRID_SIZE` must be odd!");

const CELL_SIZE = GRID_DIM / GRID_SIZE;

// Clock hand length parameters
const RADIUS = GRID_SIZE / 2;
const SECOND_LEN = 0.9 * RADIUS;
const MINUTE_LEN = 0.75 * RADIUS;
const HOUR_LEN = 0.5 * RADIUS;

// Set styling based on parameters
const root = document.documentElement;
root.style.setProperty('--GRID-SIZE', `${GRID_SIZE}`);
root.style.setProperty('--CELL-SIZE', `${CELL_SIZE}px`);

// Create grid elements
const grid = document.getElementById("grid");
if (grid === null) throw new Error("Could not find element with ID `grid`!");

const cells: HTMLDivElement[][] = [];
for (let r = 0; r < GRID_SIZE; r++) {
    const row: HTMLDivElement[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
	const cell = document.createElement("div");
	grid.appendChild(cell);
	row.push(cell);
    }
    cells.push(row);
}

// Plot points
const plot = (ratio: number, len: number, val: number) => {
    const angle = 2 * Math.PI * ratio;

    // Lerp from (0,0) to (end_x, end_y)
    const end_x = len * Math.sin(angle);
    const end_y = len * Math.cos(angle);

    const dx = Math.abs(end_x);
    const dy = Math.abs(end_y);
    const length = dx > dy ? dx : dy;

    for (let i = 0; i <= length; i++) {
	const t = i / length;
	
	const x = Math.round(t * end_x);
	const y = Math.round(t * end_y);

	const r = Math.round(-y) + Math.floor(RADIUS);
	const c = Math.round(x) + Math.floor(RADIUS);

	cells[r][c].textContent = `${val}`;
    }
}

// Render clock
const render = () => {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    
    const start = new Date(new Date().setHours(0, 0, 0, 0));
    const ms = now.getTime() - start.getTime();

    // Calculate ratios of time completed
    const TOTAL_SECONDS_MS = 60 * 1000;
    const TOTAL_MINUTES_MS = 60 * TOTAL_SECONDS_MS;
    const TOTAL_HOURS_MS = 12 * TOTAL_MINUTES_MS;

    const seconds_ratio = (ms % TOTAL_SECONDS_MS) / TOTAL_SECONDS_MS;
    const minutes_ratio = (ms % TOTAL_MINUTES_MS) / TOTAL_MINUTES_MS;
    const hours_ratio = (ms % TOTAL_HOURS_MS) / TOTAL_HOURS_MS;

    // Clear cells
    for (let r = 0; r < GRID_SIZE; r++) {
	for (let c = 0; c < GRID_SIZE; c++) {
	    cells[r][c].textContent = "";
	}
    }

    // Plot lines
    plot(hours_ratio, HOUR_LEN, hours);
    plot(minutes_ratio, MINUTE_LEN, minutes);
    plot(seconds_ratio, SECOND_LEN, seconds);
            
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
