function createTask(title, content, deadline) {
    if ([title, content, deadline].some(value => value == "")) {
        return {
            taskElement: null,
            status: false
        }
    }

    const taskElement = document.createElement("div");

    taskElement.className = "task";

    const titleElement = document.createElement("p");
    const contentElement = document.createElement("p");
    const deadlineElement = document.createElement("p");

    titleElement.textContent = title;
    titleElement.className = "title";

    contentElement.textContent = content;
    contentElement.className = "content";

    deadlineElement.textContent = deadline;
    deadlineElement.className = "deadline";

    taskElement.appendChild(titleElement);
    taskElement.appendChild(contentElement);
    taskElement.appendChild(deadlineElement);

    
    const completeTaskButtonElement = document.createElement("button");
    
    completeTaskButtonElement.type = "button";
    completeTaskButtonElement.className = "simple";
    
    const completeTaskButtonContentElement = document.createElement("i");

    completeTaskButtonContentElement.className = "bx bx-check";

    completeTaskButtonElement.appendChild(completeTaskButtonContentElement);

    taskElement.appendChild(completeTaskButtonElement);

    return {
        taskElement: taskElement,
        status: true
    }
}

function createCreationTaskForm(boardId) {
    const element = document.createElement("div");
    element.className = "create-task";
    
    const title = document.createElement("input");
    title.type = "text";
    title.className = "create-title";
    title.id = "title";
    title.name = "title";

    const content = document.createElement("input");
    content.type = "text";
    content.className = "create-content";
    content.id = "content";
    content.name = "content";

    const deadline = document.createElement("input");
    deadline.type = "date";
    deadline.className = "create-deadline";
    deadline.id = "deadline";
    deadline.name = "deadline";
    

    function clear() {
        title.value = "";
        content.value = "";
        deadline.value = "";
    }

    function getContent() {
        return {
            title: title.value,
            content: content.value,
            deadline: deadline.value
        }
    }


    const createButton = document.createElement("button");
    createButton.className = "simple";
    createButton.innerHTML = "<i class='bx bx-plus-circle'></i>";
    
    element.appendChild(title);
    element.appendChild(content);
    element.appendChild(deadline);
    element.appendChild(createButton);
    
    createButton.onclick = () => {
        const { taskElement, status } = createTask(...Object.values(getContent()));
        
        if (status) {
            document.getElementById(boardId)
                .getElementsByClassName("tasks")[0]
                .appendChild(taskElement);
            
            clear();
            title.focus();
            return
        }
        
        alert("Необходимо заполнить все поля!");
    };
    

    return element;
}

/**
 * Creates a board with recieved arguments
 * 
 * @param {string} title Board title
 * @param {Object[]} tasks Array of tasks
 */
function createBoard(title, tasks) {
    const boardElement = document.createElement("div");
    boardElement.id = title
        .toLowerCase()
        .replace(/ /g, "_");
    boardElement.className = "flex-column board";
    
    
    const boardHeadElement = document.createElement("div");
    boardHeadElement.className = "flex-row board-head";

    const boardTitleElement = document.createElement("div");
    boardTitleElement.className = "board-title";
    boardTitleElement.innerText = title;

    const configBoardButtonElement = document.createElement("button");
    configBoardButtonElement.type = "button";
    configBoardButtonElement.className = "simple";
    configBoardButtonElement.innerHTML = "<i class='bx bx-cog' ></i>";

    configBoardButtonElement.addEventListener(
        "click",
        () => {
            console.log("Clicked", title, "settings button");
        }
    )

    boardHeadElement.appendChild(boardTitleElement);
    boardHeadElement.appendChild(configBoardButtonElement);

    boardElement.appendChild(boardHeadElement);


    const tasksElement = document.createElement("div");
    tasksElement.className = "tasks";

    tasks.forEach(task => {
        tasksElement.appendChild(
            createTask(
                task.title,
                task.content,
                task.deadline
            ).taskElement
        );
    });

    boardElement.appendChild(tasksElement);


    const creationTaskForm = createCreationTaskForm(boardElement.id);

    boardElement.appendChild(creationTaskForm);

    return boardElement;
}

const fetchBoards = async (apiRoot) => {
    try {
        const response = await fetch(apiRoot + "boards/");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const json = await response.json();

        return json;
    } catch (error) {
        console.error('Error fetching boards:', error);
    }
}

/************************** main **************************/

const API = "http://127.0.0.1:8080/api/v1/";

async function main() {
    const boards = (await fetchBoards(API)).boards;

    const boardsElement = document.getElementById("boards");

    for (let [title, tasks] of Object.entries(boards)) {
        boardsElement.appendChild(createBoard(title, tasks));
    }
}

main()
