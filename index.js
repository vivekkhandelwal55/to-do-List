const inputField = document.querySelector('.text-field')
const sumbitButton = document.querySelector('.sumbit-button')
const tabs = document.querySelectorAll('.tab')
const todoList = document.querySelector('.todo-list')
const delButton = document.querySelector('.delete-button')
const inputContainer = document.querySelector('.input-container')
const line = document.querySelector('.line');

let todos = [];
let list = localStorage.getItem('todos');
if (list != null) {
    todos = JSON.parse(list);
    displayAll();
}


function saveTodoToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

inputField.addEventListener('input', (e) => {
    if (inputField.value == "" && !sumbitButton.classList.contains('off')) {
        sumbitButton.classList.add('off')
        sumbitButton.classList.remove('on')
    } else if (inputField.value != "" && !sumbitButton.classList.contains('on')) {
        sumbitButton.classList.add('on')
        sumbitButton.classList.remove('off')
    }
})

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('selected'));
        tab.classList.add('selected');
        if (tab.classList.contains('active')) {
            displayActive();
        } else if (tab.classList.contains('completed')) {
            displayCompleted();
        } else {
            displayAll();
        }
        line.style.width = e.target.offsetWidth + "px";
        line.style.left = e.target.offsetLeft + "px";
    });
});




sumbitButton.addEventListener('click', sumbitForm)
function sumbitForm(e) {
    if (sumbitButton.classList.contains('on')) {
        e.preventDefault();
        addTodo(inputField.value)
        inputField.value = ''
        sumbitButton.classList.add('off')
        sumbitButton.classList.remove('on')
    }
}

delButton.addEventListener('click', deleteAllTodos);



function resetTodoHtml() {
    todoList.innerHTML = ''
}



function displayAll() {
    resetTodoHtml();
    addTodoItemToView(todos);
    hideDeleteButton();
    showInputArea();
}

function displayCompleted() {
    // filtered List
    const filteredTodos = todos.filter(todo => todo.completed)
    //resetting list of todo
    resetTodoHtml();
    addTodoItemToView(filteredTodos);
    hideInputArea();
    //remove delete button
    delButton.classList.remove('hide')
    showDeleteButton()
}



function displayActive() {
    // filtered List
    const filteredTodos = todos.filter(todo => !todo.completed)
    //resetting list of todo
    resetTodoHtml();
    addTodoItemToView(filteredTodos);
    hideDeleteButton();
    showInputArea();
}


function showInputArea() {
    if (inputContainer.classList.contains('hide')) {
        inputContainer.classList.remove('hide')
    }
}

function hideInputArea() {
    if (!inputContainer.classList.contains('hide')) {
        inputContainer.classList.add('hide')
    }
}

function showDeleteButton() {
    const deleteItemButtons = document.querySelectorAll('.deleteItemButton');
    delButton.classList.remove('hide')
    deleteItemButtons.forEach(deleteItemButton => {
        deleteItemButton.classList.remove('hide');
    })
}

function hideDeleteButton() {
    const deleteItemButtons = document.querySelectorAll('.deleteItemButton');
    if (!delButton.classList.contains('hide')) {
        delButton.classList.add('hide')
        deleteItemButtons.forEach(deleteItemButton => {
            deleteItemButton.classList.add('hide');
        })
    }
}
function addTodo(text) {
    const todo = {
        id: Math.random(),
        text,
        completed: false,
    };
    todos.push(todo);
    displayAll()
    markSelectedTab('all')
    if (!delButton.classList.contains('hide')) {
        delButton.classList.add('hide')
    }
    saveTodoToLocalStorage();
}

function markSelectedTab(name) {
    tabs.forEach(tab => {
        if (tab.classList.contains(name)) {
            tab.classList.add('selected');
        } else {
            tab.classList.remove('selected');
        }
    })
}


function addTodoItemToView(filteredTodo) {
    filteredTodo.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');

        listItem.innerHTML = `
        <div class="item">
        <div class="leading" >
        <input type="checkbox" class="check-button" ${todo.completed ? 'checked' : ''}>
        <span>${todo.text}</span>
        </div>
        <i class="material-icons deleteItemButton hide">delete</i>
        </div>`;

        if (todo.completed) {
            listItem.querySelector('.leading').classList.add('checked');
        }

        itemCheckedStatusListener(listItem,todo)
        deleteItemListener(listItem,todo);
        todoList.appendChild(listItem);
    });
}

function deleteItemListener(listItem,todo){
    listItem.querySelector('i').addEventListener('click', () => {
        const index = todos.indexOf(todo);
        if (index > -1) {
            todos.splice(index, 1);
        }
        todoList.removeChild(listItem);
        saveTodoToLocalStorage();
    })
}

function itemCheckedStatusListener(listItem,todo){
    listItem.querySelector('input').addEventListener('change', () => {
        todo.completed = !todo.completed;
        if (todo.completed) {
            listItem.querySelector('.leading').classList.add('checked');
        } else {
            listItem.querySelector('.leading').classList.remove('checked');
        }
        saveTodoToLocalStorage();
    })
}


function deleteAllTodos() {
    todos = todos.filter(todo => !todo.completed);
    displayCompleted()
    saveTodoToLocalStorage();
}