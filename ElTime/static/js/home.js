/**
 * Creates task edition form and switched with task element untill changes cancelled or applyed
 * 
 * @param {string} board Board title
 * @param {HTMLDivElement} taskElement An element which will be temporary changed with its function result
 * @param {HTMLParagraphElement} raisedElement The element raised task editing
 */
function runTaskEditing(board, taskElement, raisedElement) {
    const initialState = {
        title: taskElement.getElementsByClassName("title")[0].innerText,
        content: taskElement.getElementsByClassName("content")[0].innerText,
        deadline: taskElement.getElementsByClassName("deadline")[0].innerText
    }

    const replacingRowElement = document.createElement("div");
    replacingRowElement.className = "task editing-row";


    const createInput = (className, value) => {
        const input = document.createElement("input");
        input.value = value;
        input.className = className;

        return input;
    }

    const titleInput = createInput("title", initialState.title);
    titleInput.maxLength = "50";

    const contentTextarea = document.createElement("textarea");
    contentTextarea.style.height = "250px";
    contentTextarea.style.resize = "vertical";
    contentTextarea.maxLength = "512";
    contentTextarea.value = initialState.content;
    contentTextarea.className = "content";

    const deadlineInput = createInput("deadline", initialState.deadline);
    deadlineInput.type = "date";
    deadlineInput.className += " edit-deadline";

    [titleInput, contentTextarea, deadlineInput].forEach(element => {
        replacingRowElement.appendChild(element);

        element.addEventListener(
            "keydown",
            async (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    await requestUpdateTask();
                }
            }
        )
    });

    taskElement.style.display = "none";
    taskElement.before(replacingRowElement);

    replacingRowElement
        .getElementsByClassName(raisedElement.className)[0].focus();


    const completeTaskEditingButtonElement = document.createElement("button");

    completeTaskEditingButtonElement.type = "button";
    completeTaskEditingButtonElement.className = "simple";
    completeTaskEditingButtonElement.innerHTML = "<i class='bx bx-check'></i>";

    completeTaskEditingButtonElement.addEventListener(
        "click",
        async (event) => await requestUpdateTask()
    )

    title.style.top = "-2px";
    replacingRowElement.appendChild(completeTaskEditingButtonElement);


    function exitTaskEditing() {
        document.removeEventListener(
            "click",
            catchOutsideClick
        );

        taskElement.style.display = "grid";
        replacingRowElement.remove();

        APPLICATION_MODE = APP_MODES.normal;
    }


    async function requestUpdateTask() {
        const response = await request.post(
            API + "tasks/update/",
            JSON.stringify({
                board: board,
                previous: {
                    title: initialState.title,
                    content: initialState.content,
                    deadline: initialState.deadline
                },
                new: {
                    title: titleInput.value.trim(),
                    content: contentTextarea.value.trim(),
                    deadline: deadlineInput.value.trim()
                },
            })
        );

        if (response.status === 202) {
            newTaskData = response.data;

            ["title", "content", "deadline"].forEach(className => {
                taskElement.getElementsByClassName(className)[0].innerText =
                    newTaskData[className];
            });
        } else {
            console.log("Ошибка:" + response.data);
        }

        exitTaskEditing();
    }

    function catchOutsideClick(event) {
        const inReplacingRowElement = [
            replacingRowElement,
            titleInput,
            deadlineInput,
            contentTextarea,
            raisedElement
        ].includes(event.target);

        if (!inReplacingRowElement &&
            APPLICATION_MODE === APP_MODES.editingTask
        ) {
            exitTaskEditing();
        }
    }

    document.addEventListener(
        "click",
        catchOutsideClick
    );


    APPLICATION_MODE = APP_MODES.editingTask;
}

/**
 * Creates a DOM element for task visualization & manipulation
 * 
 * @param {string} boardTitle Board title
 * @param {string} title Task title
 * @param {string} content Task content
 * @param {string} deadline Task deadline date
 * 
 * @returns {HTMLDivElement} An element representing task visualisation and
 *                              its manipulation
 */
function createTask(boardTitle, title, content, deadline) {
    if ([title, content, deadline].some(value => value === "")) {
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

    titleElement.innerText = title;
    titleElement.className = "title";

    contentElement.innerText = content;
    contentElement.className = "content";

    deadlineElement.innerText = deadline;
    deadlineElement.className = "deadline";

    [titleElement, contentElement, deadlineElement].forEach(element => {
        taskElement.appendChild(element);

        element.addEventListener(
            "click",
            () => runTaskEditing(boardTitle, taskElement, element)
        );
    });


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
    completeTaskButtonElement.innerHTML = "<i class='bx bx-check-double'></i>";

    completeTaskButtonElement.addEventListener(
        "click",
        async () => {
            const { status } = await request.post(
                API + "tasks/delete/",
                JSON.stringify({
                    board: boardTitle,
                    task: {
                        title: titleElement.innerText || "",
                        content: contentElement.innerText || "",
                        deadline: deadlineElement.innerText || ""
                    }
                })
            )

            if (status === 204) {
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


/**
 * Creates a DOM element to tasks creating
 * 
 * @param {string} boardId DOM element board id
 * @param {string} boardTitle Board title
 * 
 * @returns {HTMLDivElement} An element to creating tasks for the board
 */
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
    controllersElement.style.alignItems = "flex-start";

    const title = document.createElement("input");
    title.maxLength = "50";
    title.type = "text";
    title.className = "create-title";
    title.id = "title";
    title.name = "title";

    const content = document.createElement("textarea");
    content.style.resize = "vertical";
    content.type = "text";
    content.className = "create-content";
    content.id = "content";
    content.name = "content";

    const deadline = document.createElement("input");
    deadline.type = "date";
    deadline.className = "create-deadline";
    deadline.id = "deadline";
    deadline.name = "deadline";

    setTodaysDate();

    
    function setTodaysDate() {
        const today = new Date();
    
        deadline.value = `${
            today.getFullYear()
        }-${
            String(today.getMonth() + 1).padStart(2, '0')
        }-${
            String(today.getDate()).padStart(2, '0')
        }`;
    }

    function clear() {
        title.value = "";
        content.value = "";
        setTodaysDate();
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
    createButton.innerHTML = "<i class='bx bx-message-square-add' ></i>";
    
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
            );

            if (response.status === 201) {
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
 * 
 * @returns {HTMLDivElement} Board DOM element
 */
function createBoard(title, tasks=[]) {
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

    boardHeadElement.appendChild(boardTitleElement);

    if (title !== "Мои задачи") {
        const deleteBoardButtonElement = document.createElement("button");
        deleteBoardButtonElement.type = "button";
        deleteBoardButtonElement.className = "simple";
        deleteBoardButtonElement.innerHTML = "<i class='bx bx-trash' ></i>";
    
        deleteBoardButtonElement.addEventListener(
            "click",
            async () => {
                if (confirm(
                    `Уверены, что хотите удалить борд "${title}"?\n\n` +
                    "Восстановить его будет НЕВОЗМОЖНО!"
                )) {
                    const deleteResponse = await request.post(
                        API + "boards/delete/",
                        JSON.stringify({board: title})
                    );
    
                    if (deleteResponse.status === 204) {
                        return boardElement.remove();
                    }
                    
                    alert("Ошибка! Каким-то образом вы пытаетесь удалить несуществующий борд");
                }
            }
        )

        boardHeadElement.appendChild(deleteBoardButtonElement);
    } else {
        boardTitleElement.style.paddingBottom = "15px";
    }

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


/************************** main **************************/

const API = "http://127.0.0.1:8080/api/v1/";

const APP_MODES = {
    normal: ">    Normal application mode    <",
    editingTask: "> Task editing application mode <",
}

let APPLICATION_MODE = APP_MODES.normal;

const request = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
});

async function main() {
    const boards = (await request.get(API + "boards/")).data.boards;

    const boardsElement = document.getElementById("boards");

    for (let [title, tasks] of Object.entries(boards)) {
        boardsElement.appendChild(createBoard(title, tasks));
    }
}

main()
