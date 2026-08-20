const activeList = document.getElementById('active-list');
const newTaskInput = document.getElementById('new-task-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const listTasks = document.getElementById('active-list');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbers = document.getElementById('page-numbers');
const emptyState = document.getElementById('empty-state');

// Модальное окно
const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-task-input');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalSaveBtn = document.getElementById('modal-save-btn');

let id_task = 1;
let allTasksBut = true;
let activeTasksBut = false;
let completedTasksBut = false;

let tasks = [];

let currentPage = 1;
const rowsPerPage = 5;
let totalPages = 1;
let editingTaskId = null;

let clickTimer = null;


function getFilteredTasks() {
    if (allTasksBut) return tasks;
    if (activeTasksBut) return tasks.filter(item => !item.isDone);
    if (completedTasksBut) return tasks.filter(item => item.isDone);
    return tasks;
}

function renderTasks() {
    const filtered = getFilteredTasks();
    totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    activeList.innerHTML = '';
    emptyState.hidden = paginated.length > 0;

    paginated.forEach(item => {
        activeList.insertAdjacentHTML('beforeend', `
            <li class="task" data-id="${item.id}">
                <label class="task-label" id="task-label${item.id}">
                    <input type="checkbox" class="task-checkbox" ${item.isDone ? 'checked' : ''}>
                    <span class="custom-checkbox"></span>
                    <span class="task-text">${item.title}</span>
                </label>
                <button class="delete-btn" id="${item.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </li>
        `);
    });

    updatePaginationControls(filtered.length);
}

function updatePaginationControls(totalItems) {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalItems === 0;
    pageNumbers.innerHTML = '';

    if (totalItems === 0) {
        const btn = document.createElement('button');
        btn.className = 'page-number active';
        btn.textContent = '1';
        btn.disabled = true;
        pageNumbers.appendChild(btn);
        return;
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (endPage - startPage < 4) {
        if (startPage === 1) endPage = Math.min(5, totalPages);
        else if (endPage === totalPages) startPage = Math.max(1, totalPages - 4);
    }

    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) addEllipsis();
    }
    for (let i = startPage; i <= endPage; i++) addPageButton(i);
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) addEllipsis();
        addPageButton(totalPages);
    }
}

function addPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.className = `page-number ${pageNum === currentPage ? 'active' : ''}`;
    btn.textContent = pageNum;
    btn.addEventListener('click', () => {
        currentPage = pageNum;
        renderTasks();
    });
    pageNumbers.appendChild(btn);
}

function addEllipsis() {
    const span = document.createElement('span');
    span.textContent = '…';
    span.style.color = 'var(--text-muted)';
    span.style.padding = '0 4px';
    pageNumbers.appendChild(span);
}

function menuTasks() {
    currentPage = 1;
    renderTasks();
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    editingTaskId = taskId;
    editInput.value = task.title;
    editModal.hidden = false;
    editInput.focus();
    editInput.select();
}

function closeEditModal() {
    editModal.hidden = true;
    editingTaskId = null;
    editInput.value = '';
}

function saveEditedTask() {
    const newTitle = editInput.value.trim();
    if (!newTitle) return;
    const task = tasks.find(t => t.id === editingTaskId);
    if (!task) return;
    task.title = newTitle;
    closeEditModal();
    renderTasks();
}

confirmBtn.addEventListener('click', () => {
    const val = newTaskInput.value.trim();
    if (!val) return;
    id_task++;
    tasks.push({ id: id_task, title: val, isDone: false });
    newTaskInput.value = '';
    menuTasks();
});
newTaskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') confirmBtn.click();
});
cancelBtn.addEventListener('click', () => {
    newTaskInput.value = '';
});

// Вкладки
document.getElementById('all').addEventListener('click', () => {
    allTasksBut = true; activeTasksBut = false; completedTasksBut = false;
    menuTasks();
});
document.getElementById('active').addEventListener('click', () => {
    allTasksBut = false; activeTasksBut = true; completedTasksBut = false;
    menuTasks();
});
document.getElementById('completed').addEventListener('click', () => {
    allTasksBut = false; activeTasksBut = false; completedTasksBut = true;
    menuTasks();
});

document.getElementById('delete-all-btn').addEventListener('click', () => {
    tasks = [];
    menuTasks();
});
document.getElementById('delete-completed-btn').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.isDone);
    menuTasks();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderTasks(); }
});
nextPageBtn.addEventListener('click', () => {
    const filtered = getFilteredTasks();
    const total = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage < total) { currentPage++; renderTasks(); }
});

document.getElementById('select-all-btn').addEventListener('click', () => {
    const filtered = getFilteredTasks();
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const allChecked = paginated.every(t => t.isDone);
    paginated.forEach(t => t.isDone = !allChecked);
    renderTasks();
});

activeList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const taskId = parseInt(deleteBtn.id);
        tasks = tasks.filter(t => t.id !== taskId);
        menuTasks();
        return;
    }
    const checkbox = e.target.closest('.task-checkbox');
    if (checkbox) {
        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
            return; 
        }
        clickTimer = setTimeout(() => {
            clickTimer = null;
            const label = checkbox.closest('.task-label');
            const taskId = parseInt(label.id.replace('task-label', ''));
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.isDone = checkbox.checked;
                renderTasks();
            }
        }, 200);
    }
});

activeList.addEventListener('dblclick', (e) => {
    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }
    const taskElement = e.target.closest('.task');
    if (!taskElement) return;
    e.preventDefault(); 
    const taskId = parseInt(taskElement.dataset.id);
    openEditModal(taskId);
});

modalCloseBtn.addEventListener('click', closeEditModal);
modalCancelBtn.addEventListener('click', closeEditModal);
modalSaveBtn.addEventListener('click', saveEditedTask);
editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEditedTask();
});
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModal.hidden) closeEditModal();
});

menuTasks();