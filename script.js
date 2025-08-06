const calendar = document.getElementById('calendar');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

const totalDays = 201;

function parseDateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const dateStr = params.get("date");
    if (dateStr) {
        const [dd, mm, yyyy] = dateStr.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
    }
    return null;
}

const fixedStartDate = new Date("2025-08-05");
fixedStartDate.setHours(0, 0, 0, 0);
const currentDate = parseDateFromURL() || new Date();
currentDate.setHours(0, 0, 0, 0);

const months = {};

for (let i = 0; i < totalDays; i++) {
    const date = new Date(fixedStartDate);
    date.setDate(fixedStartDate.getDate() + i);

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[monthKey]) {
        months[monthKey] = {
            name: date.toLocaleString('en-US', { month: 'short' }),
            days: []
        };
    }

    const cell = document.createElement('div');
    cell.classList.add('cell');

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const dayNumber = i + 1;
    const percent = ((dayNumber / totalDays) * 100).toFixed(2);
    cell.title = `Day ${dayNumber} (${percent}%)`;

    if (compareDate < currentDate) {
        cell.classList.add('past');
    } else if (compareDate.getTime() === currentDate.getTime()) {
        const now = new Date();
        const hoursPassed = now.getHours() + now.getMinutes() / 60;
        const percentPassed = Math.min((hoursPassed / 24) * 100, 100).toFixed(2);
        cell.style.background = `linear-gradient(to right, #e74c3c ${percentPassed}%, #f1c40f ${percentPassed}%)`;
        cell.style.color = "black";
    } else {
        cell.classList.add('future');
    }

    cell.textContent = date.toLocaleDateString('ru-RU');
    months[monthKey].days.push(cell);
}

const daysPassed = Math.floor((currentDate - fixedStartDate) / (1000 * 60 * 60 * 24)) + 1;
const progress = Math.min((daysPassed / totalDays) * 100, 100).toFixed(2);
progressText.textContent = `${Math.max(daysPassed, 0)}/${totalDays} (${progress}%)`;
progressBar.style.width = `${progress}%`;

for (const key in months) {
    const column = document.createElement('div');
    column.classList.add('month-column');

    const header = document.createElement('div');
    header.classList.add('month-header');
    header.textContent = months[key].name;
    column.appendChild(header);

    const monthGrid = document.createElement('div');
    monthGrid.classList.add('month-grid');

    months[key].days.forEach(dayCell => monthGrid.appendChild(dayCell));
    column.appendChild(monthGrid);

    calendar.appendChild(column);
}
