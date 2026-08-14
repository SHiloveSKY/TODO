const activeList = document.getElementById('active-list');
const completedList = document.getElementById('completed-list');
const completedCount = document.getElementById('completed-count');
const addForm = document.getElementById('add-form');
const newTaskInput = document.getElementById('new-task-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

let completed = 0;

// Чекбоксы — перемещение между списками
document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('task-checkbox')) return;

    const task = e.target.closest('.task');
    if (e.target.checked) {
        completedList.appendChild(task);
        completed++;
    } else {
        activeList.appendChild(task);
        completed--;
    }
    completedCount.textContent = completed;
});

// Отмена
cancelBtn.addEventListener('click', () => {
    addForm.hidden = true;
    newTaskInput.value = '';
});

// Добавить задачу
function addTask() {
    const text = newTaskInput.value.trim();
    if (!text) return;

    const li = document.createElement('li');
    li.className = 'task';
    li.innerHTML = `
        <label class="task-label">
            <input type="checkbox" class="task-checkbox">
            <span class="custom-checkbox"></span>
            <span class="task-text">${text}</span>
        </label>
    `;
    activeList.appendChild(li);

    newTaskInput.value = '';
    addForm.hidden = true;
}

confirmBtn.addEventListener('click', addTask);

newTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Escape') {
        addForm.hidden = true;
        newTaskInput.value = '';
    }
});