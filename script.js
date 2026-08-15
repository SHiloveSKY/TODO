const activeList = document.getElementById('active-list');
const newTaskInput = document.getElementById('new-task-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const listTasks = document.getElementById('active-list');


let id_task = 1
let task = {};

let allTasks = true;
let activeTasks = false;
let completedTasks = false;


tasks = [
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
    
    if (allTasks){
        activeTasks = tasks;
    } 
    else if (activeTasks){
        activeTasks = tasks.filter(item => item.isDone === false);
    } 
    else if (completedTasks){
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
    allTasks = true;
    activeTasks = false;
    completedTasks = false;
    menuTasks();
});

document.getElementById('active').addEventListener('click', function () {
    allTasks = false;
    activeTasks = true;
    completedTasks = false;      
    menuTasks();
});

document.getElementById('completed').addEventListener('click', function () {
    allTasks = false;
    activeTasks = false;
    completedTasks = true;    
    menuTasks();
});

