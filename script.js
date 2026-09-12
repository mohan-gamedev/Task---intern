let tasks =
JSON.parse(
localStorage.getItem("kanbanPro")
) || [];

function saveTasks(){

    localStorage.setItem(
        "kanbanPro",
        JSON.stringify(tasks)
    );

}

function addTask(){

    let taskInput =
    document.getElementById("taskInput");

    let description =
    document.getElementById("description");

    let dueDate =
    document.getElementById("dueDate");

    let priority =
    document.getElementById("priority");

    if(taskInput.value.trim()===""){
        alert("Enter Task Name");
        return;
    }

    tasks.push({

        id:"task"+Date.now(),

        text:taskInput.value,

        description:
        description.value,

        date:
        dueDate.value,

        priority:
        priority.value,

        status:"todo"

    });

    taskInput.value="";
    description.value="";
    dueDate.value="";

    saveTasks();
    renderTasks();

}

function renderTasks(){

    document.getElementById("todo").innerHTML="";
    document.getElementById("progress").innerHTML="";
    document.getElementById("done").innerHTML="";

    let searchText =
    document.getElementById("search")
    .value
    .toLowerCase();

    tasks
    .filter(task =>
        task.text
        .toLowerCase()
        .includes(searchText)
    )
    .forEach(task => {

        let div =
        document.createElement("div");

        div.className =
        "task " + task.priority;

        div.id = task.id;

        div.draggable = true;

        div.addEventListener(
            "dragstart",
            drag
        );

        div.innerHTML = `

        <h6>${task.text}</h6>

        <small>
        ${task.description}
        </small>

        <small>
        📅 ${task.date || "No Date"}
        </small>

        <small>
        ⭐ ${task.priority.toUpperCase()}
        </small>

        <div class="task-buttons">

            <button
            class="btn btn-sm btn-light"
            onclick="editTask('${task.id}')">

            Edit

            </button>

            <button
            class="btn btn-sm btn-danger"
            onclick="deleteTask('${task.id}')">

            Delete

            </button>

        </div>

        `;

        document
        .getElementById(task.status)
        .appendChild(div);

    });

    updateDashboard();

}

function editTask(id){

    let task =
    tasks.find(
        t => t.id === id
    );

    let newTask =
    prompt(
        "Edit Task",
        task.text
    );

    if(newTask){

        task.text =
        newTask;

        saveTasks();

        renderTasks();

    }

}

function deleteTask(id){

    if(confirm("Delete Task?")){

        tasks =
        tasks.filter(
            task => task.id !== id
        );

        saveTasks();

        renderTasks();

    }

}

function allowDrop(event){

    event.preventDefault();

}

function drag(event){

    event.dataTransfer.setData(
        "text/plain",
        event.target.id
    );

}

function drop(event){

    event.preventDefault();

    let taskId =
    event.dataTransfer.getData(
        "text/plain"
    );

    let dropZone =
    event.currentTarget;

    let task =
    tasks.find(
        t => t.id === taskId
    );

    if(task){

        task.status =
        dropZone.id;

        saveTasks();

        renderTasks();

    }

}

function updateDashboard(){

    let total =
    tasks.length;

    let todo =
    tasks.filter(
        t => t.status==="todo"
    ).length;

    let progress =
    tasks.filter(
        t => t.status==="progress"
    ).length;

    let done =
    tasks.filter(
        t => t.status==="done"
    ).length;

    document.getElementById(
        "totalTasks"
    ).innerText = total;

    document.getElementById(
        "todoCount"
    ).innerText = todo;

    document.getElementById(
        "progressCount"
    ).innerText = progress;

    document.getElementById(
        "doneCount"
    ).innerText = done;

    let percentage = 0;

    if(total > 0){

        percentage =
        Math.round(
            (done / total) * 100
        );

    }

    let progressBar =
    document.getElementById(
        "progressBar"
    );

    progressBar.style.width =
    percentage + "%";

    progressBar.innerHTML =
    percentage + "%";

}

function toggleTheme(){

    document.body.classList.toggle(
        "dark-mode"
    );

    localStorage.setItem(

        "theme",

        document.body.classList.contains(
            "dark-mode"
        )

    );

}

if(
localStorage.getItem("theme")
=== "true"
){

    document.body.classList.add(
        "dark-mode"
    );

}

function exportTasks(){

    let data =
    JSON.stringify(
        tasks,
        null,
        2
    );

    let blob =
    new Blob(
        [data],
        {
            type:
            "application/json"
        }
    );

    let a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "kanban_tasks.json";

    a.click();

}

function importTasks(event){

    let file =
    event.target.files[0];

    if(!file) return;

    let reader =
    new FileReader();

    reader.onload =
    function(e){

        tasks =
        JSON.parse(
            e.target.result
        );

        saveTasks();

        renderTasks();

    };

    reader.readAsText(file);

}

renderTasks();
