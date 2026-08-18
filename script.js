const activeList = document.getElementById('active-list');
const newTaskInput = document.getElementById('new-task-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const listTasks = document.getElementById('active-list');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbers = document.getElementById('page-numbers');
const emptyState = document.getElementById('empty-state');

let id_task = 1;
let task = {};
let allTasksBut = true;
let activeTasksBut = false;
let completedTasksBut = false;
let currentPage = 1;
let tasks = [];
const rowsPerPage = 5;

function addTask() {
    if(newTaskInput.value.trim() == "") {
        return;
    }
    id_task++;
    tasks.push({
        id: id_task,
        title: newTaskInput.value.trim(),
        isDone: false
    });
    newTaskInput.value = '';
    menuTasks();
}

function getFilteredTasks() {
    if (allTasksBut) {
        return tasks;
    } else if (activeTasksBut) {
        return tasks.filter(item => item.isDone === false);
    } else if (completedTasksBut) {
        return tasks.filter(item => item.isDone === true);
    }
    return tasks;
}

function getPaginatedTasks(filteredTasks) {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredTasks.slice(startIndex, endIndex);
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    const paginatedTasks = getPaginatedTasks(filteredTasks);
    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / rowsPerPage));
    
    if (currentPage > totalPages) {
        currentPage = totalPages;
        renderTasks();
        return;
    }
    
    activeList.innerHTML = '';
    
    if (paginatedTasks.length === 0) {
        emptyState.hidden = false;
    } else {
        emptyState.hidden = true;
    }
    
    paginatedTasks.forEach(item => {
        listTasks.insertAdjacentHTML('beforeend', `
            <li class="task">
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
    
    updatePagination(filteredTasks.length, totalPages);
}

function updatePagination(totalItems, totalPages) {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalItems === 0;
    
    pageNumbers.innerHTML = '';
    
    if (totalItems === 0) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number active';
        pageBtn.textContent = '1';
        pageBtn.disabled = true;
        pageNumbers.appendChild(pageBtn);
        return;
    }
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(5, totalPages);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - 4);
        }
    }
    
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageButton(totalPages);
    }
}

function addPageButton(pageNum) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-number ${pageNum === currentPage ? 'active' : ''}`;
    pageBtn.textContent = pageNum;
    pageBtn.addEventListener('click', () => {
        currentPage = pageNum;
        renderTasks();
    });
    pageNumbers.appendChild(pageBtn);
}

function addEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '…';
    ellipsis.style.color = 'var(--text-muted)';
    ellipsis.style.padding = '0 4px';
    pageNumbers.appendChild(ellipsis);
}

function menuTasks() {
    currentPage = 1; 
    renderTasks();
}

menuTasks();

confirmBtn.addEventListener('click', function () {
    addTask();
});

newTaskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

cancelBtn.addEventListener('click', function () {
    newTaskInput.value = '';
});

document.getElementById('all').addEventListener('click', function () {
    allTasksBut = true;
    activeTasksBut = false;
    completedTasksBut = false;
    menuTasks();
});

document.getElementById('active').addEventListener('click', function () {
    allTasksBut = false;
    activeTasksBut = true;
    completedTasksBut = false;
    menuTasks();
});

document.getElementById('completed').addEventListener('click', function () {
    allTasksBut = false;
    activeTasksBut = false;
    completedTasksBut = true;
    menuTasks();
});

document.getElementById('delete-all-btn').addEventListener('click', function () {
    tasks = [];
    menuTasks();
});

document.getElementById('delete-completed-btn').addEventListener('click', function () {
    tasks = tasks.filter(task => !task.isDone);
    menuTasks();
});

prevPageBtn.addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        renderTasks();
    }
});

nextPageBtn.addEventListener('click', function () {
    const filteredTasks = getFilteredTasks();
    const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTasks();
    }
});

activeList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const taskId = parseInt(deleteBtn.id);
        tasks = tasks.filter(task => task.id !== taskId);
        menuTasks();
        return;
    }
    
    const checkbox = e.target.closest('.task-checkbox');
    if (checkbox) {
        const label = checkbox.closest('.task-label');
        const taskId = parseInt(label.id.replace('task-label', ''));
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.isDone = checkbox.checked;

            renderTasks();
        }
    }
});


document.getElementById('select-all-btn').addEventListener('click', function () {
    const filteredTasks = getFilteredTasks();
    const paginatedTasks = getPaginatedTasks(filteredTasks);
    const allChecked = paginatedTasks.every(task => task.isDone);
    
    paginatedTasks.forEach(task => {
        task.isDone = !allChecked;
    });
    
    renderTasks();
});