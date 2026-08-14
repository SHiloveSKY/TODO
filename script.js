const activeList = document.getElementById('active-list');
const completedList = document.getElementById('completed-list');
const completedCount = document.getElementById('completed-count');
const addForm = document.getElementById('add-form');
const newTaskInput = document.getElementById('new-task-input');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

let id_task = 1
let task = {};
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
    id_task++;
    tasks.push({
        id: id_task,
        title: newTaskInput.value,
        isDone: true
    })
}

function artTasks() {
    id_task++;
    tasks.push({
        id: id_task,
        title: newTaskInput.value,
        isDone: true
    })
}

confirmBtn.addEventListener('click', function () {
    addTask();
    console.log(tasks);
    newTaskInput.value = '';
});

cancelBtn.addEventListener('click', function () {
    newTaskInput.value = '';
});


