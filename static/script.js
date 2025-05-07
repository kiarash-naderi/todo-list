let tasks = [];

const quotes = [
    "Get it done today!",
    "You got this!",
    "One task at a time.",
    "Stay focused, stay awesome.",
    "Make today count!"
];

function displayRandomQuote() {
    const quoteElement = document.getElementById('motivational-quote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = '';
    quoteElement.classList.remove('typing');
    void quoteElement.offsetWidth; // Trigger reflow
    quoteElement.textContent = randomQuote;
    quoteElement.classList.add('typing');
    setTimeout(displayRandomQuote, 10000); // Change quote every 10 seconds
}

// Initialize Particle.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#8b5cf6' }, // Brighter purple
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#7c3aed', opacity: 0.4, width: 1 }, // Brighter purple for lines
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out' }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
});

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value,
        units: parseInt(document.getElementById('units').value)
    };

    try {
        await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        document.getElementById('form').reset();
        loadTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

document.getElementById('priority-filter').addEventListener('change', () => {
    renderTasks();
});

async function loadTasks() {
    try {
        const response = await fetch('/tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function renderTasks() {
    const filter = document.getElementById('priority-filter').value;
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.priority === filter);

    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.priority} ${task.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description || 'No description'}</p>
                <p>Units: ${task.units} | Date: ${task.date}</p>
            </div>
            <div class="task-actions">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete('${encodeURIComponent(task.title)}', this.checked)">
                <button class="delete-btn" data-title="${encodeURIComponent(task.title)}">Delete</button>
            </div>
        `;
        taskList.appendChild(card);
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const title = e.target.getAttribute('data-title');
            deleteTask(decodeURIComponent(title));
        }
    });
}

async function toggleComplete(title, completed) {
    try {
        await fetch(`/tasks/${title}/complete`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        loadTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(title) {
    try {
        const response = await fetch(`/tasks/${encodeURIComponent(title)}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status}`);
        }
        loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

loadTasks();
displayRandomQuote();