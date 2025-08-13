const currentWallet = 86;
//-------------------------------------------------------//
//-------------------------------------------------------//
//-------------------------------------------------------//
const initialWallet = 86;
const targetWallet = 2500;
const totalDays = 201;
const fixedStartDate = new Date("2025-08-05");
//-------------------------------------------------------//
//-------------------------------------------------------//
//-------------------------------------------------------//
const calendar = document.getElementById('calendar');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

function parseDateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const dateStr = params.get("date");
    if (dateStr) {
        const [dd, mm, yyyy] = dateStr.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
    }
    return null;
}

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

const now = parseDateFromURL() || new Date();
const msPassed = now - fixedStartDate;
const daysPassed = msPassed / (1000 * 60 * 60 * 24);
const progress = Math.min((daysPassed / totalDays) * 100, 100).toFixed(2);

progressText.textContent = `${daysPassed.toFixed(1)}/${totalDays} (${progress}%)`;
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

const walletProgressText = document.getElementById('wallet-progress-text');
const walletProgressBar = document.getElementById('wallet-progress-bar');

function updateWalletProgress(current, initial, target) {
    let text = '';
    let width = 0;
    let color = '';

    if (current >= initial) {
        const gain = current - initial;
        const range = target - initial;
        const percent = Math.min((gain / range) * 100, 100).toFixed(2);
        text = `$${current - initial}/$${target} (${percent}%)`;
        width = percent + '%';
        color = '#27ae60';
    } else {
        const loss = initial - current;
        const percent = Math.min((loss / initial) * 100, 100).toFixed(2);
        text = `$${current} ↓ $${initial} (-${percent}%)`;
        width = percent + '%';
        color = '#e74c3c';
    }

    walletProgressText.textContent = text;
    walletProgressBar.style.width = width;
    walletProgressBar.style.backgroundColor = color;
}

updateWalletProgress(currentWallet, initialWallet, targetWallet);
