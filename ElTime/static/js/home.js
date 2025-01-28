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


    const createTask = (title, content, deadline) => {
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


const getBoards = () => {
    return document.getElementById("boards").children;
}

const updateCreateTaskForms = () => {
    const boards = getBoards();

    for (let index = 0; index < boards.length; index++) {
        const board = boards.item(index);

        board.appendChild(createCreationTaskForm(board.id));
    }
}


updateCreateTaskForms();
