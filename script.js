const activeList = document.getElementById('active-list');
const newTaskInput = document.getElementById('new-task-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const listTasks = document.getElementById('active-list');


let id_task = 1
let task = {};

let allTasksBut = true;
let activeTasksBut = false;
let completedTasksBut = false;


let tasks = [
    {
        id: 0,
        title: "Первая задача",
        isDone: false
    },
    {
        id: 1,
        title: "Покушать",
        isDone: true
    }
];

function addTask() {
    if(newTaskInput.value == "") {
        return
    }
    id_task++;
    tasks.push({
        id: id_task,
        title: newTaskInput.value,
        isDone: false
    })
    menuTasks();
}

function menuTasks() {
    activeList.innerHTML = '';
    let activeTasks = [];

    if (allTasksBut){
        activeTasks = tasks;
    } 
    else if (activeTasksBut){
        activeTasks = tasks.filter(item => item.isDone === false);
    } 
    else if (completedTasksBut){
        activeTasks = tasks.filter(item => item.isDone === true); 
    }
    
    // Рисуем все задачи заново
    activeTasks.forEach(item => {
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
}

menuTasks();

confirmBtn.addEventListener('click', function () {
    addTask();
    newTaskInput.value = '';
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

activeList.addEventListener('click', (e) => {
    const idValue = e.target.closest('.delete-btn');
    tasks = tasks.splice(idValue, 1);
    menuTasks();
});