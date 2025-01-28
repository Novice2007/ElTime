function createTask(boardTitle, title, content, deadline) {
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


    function getTitleElement() {
        return titleElement;
    }

    function setTitle(value) {
        titleElement.innerText = value;
    }

    function getContentElement() {
        return contentElement;
    }

    function setContent(value) {
        contentElement.innerText = value;
    }

    function getDeadlineElement() {
        return deadlineElement;
    }

    function setDeadline(value) {
        deadlineElement.innerText = value;
    }

    
    const completeTaskButtonElement = document.createElement("button");
    
    completeTaskButtonElement.type = "button";
    completeTaskButtonElement.className = "simple";
    completeTaskButtonElement.innerHTML = "<i class='bx bx-check'></i>";

    completeTaskButtonElement.addEventListener(
        "click",
        async () => {
            const { data, status } = await request.post(
                API + "tasks/delete/",
                JSON.stringify({
                    board: boardTitle,
                    task: {
                        title: titleElement.textContent || "",
                        content: contentElement.textContent || "",
                        deadline: deadlineElement.textContent || ""
                    }
                })
            )

            if (status == 204) {
                return taskElement.remove();
            }
            
            return alert("Ошибка создания задачи :(");
        }
    )

    taskElement.appendChild(completeTaskButtonElement);

    return {
        taskElement: taskElement,
        status: true,
        getTitleElement: getTitleElement,
        setTitle: setTitle,
        getContentElement: getContentElement,
        setContent: setContent,
        getDeadlineElement: getDeadlineElement,
        setDeadline: setDeadline,
    }
}

function createCreationTaskForm(boardId, boardTitle) {
    const element = document.createElement("div");
    element.className = "create-task";
    
    const headersElement = document.createElement("div");
    headersElement.className = "row";

    headersElement.innerHTML = `<p>Заголовок</p>
                <p>Описание задачи</p>
                <p>Дедлайн</p>`;
    
    element.appendChild(headersElement);
    
    const controllersElement = document.createElement("div");
    controllersElement.className = "row";

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
    
    controllersElement.appendChild(title);
    controllersElement.appendChild(content);
    controllersElement.appendChild(deadline);
    controllersElement.appendChild(createButton);
    
    element.appendChild(controllersElement);

    createButton.onclick = async () => {
        const {
            taskElement,
            status,
        } = createTask(boardTitle, ...Object.values(getContent()));
        
        if (status) {
            const response = await request.post(
                API + "tasks/create/",
                JSON.stringify({
                    board: boardTitle,
                    task: {
                        title: title.value || "",
                        content: content.value || "",
                        deadline: deadline.value || ""
                    },
                })
            )

            if (response.status == 201) {
                document.getElementById(boardId)
                    .getElementsByClassName("tasks")[0]
                    .appendChild(taskElement);
                
                clear();
                title.focus();
                return
            }

            return alert("Ошибка синхронизации с сервером :(");
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
                title,
                task.title,
                task.content,
                task.deadline
            ).taskElement
        );
    });

    boardElement.appendChild(tasksElement);


    const creationTaskForm = createCreationTaskForm(boardElement.id, title);

    boardElement.appendChild(creationTaskForm);

    return boardElement;
}


/************************** data **************************/


const fetchWithJSON = async (url, method="GET", objectData="{}") => {
    let response;
    
    if (["head", "get"].includes(method.toLowerCase())) {
        response = await fetch(url);
    } else {
        response = await fetch(
            url,
            {
                method: method,
                body: JSON.stringify(objectData),
            }
        );
    }

    if (!response.ok) {
        console.error(`Error fetching ${url}: ${response.status}`);
        return { data: null, status: response.status };
    }

    return { data: await response.json(), status: response.status };
}

const fetchBoards = async (apiRoot) => {
    return (await request.get(apiRoot + "boards/")).data
}


/************************** main **************************/

const API = "http://127.0.0.1:8080/api/v1/";

const request = axios.create({
    baseURL: API,
    withCredentials: true,
});

async function main() {
    const boards = (await fetchBoards(API)).boards;

    const boardsElement = document.getElementById("boards");

    for (let [title, tasks] of Object.entries(boards)) {
        boardsElement.appendChild(createBoard(title, tasks));
    }
}

main()
