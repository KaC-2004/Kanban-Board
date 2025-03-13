let allBoards = document.querySelectorAll(".board");

document.addEventListener("DOMContentLoaded", loadFromLocalStorage());
function handleDropzone(totalBoards){
    totalBoards.forEach((board) => {
        board.addEventListener("dragover", (e) => {
            e.preventDefault();
            const closestCard = findClosestCard(board, e.clientY);
            const flyingCard = document.querySelector(".flying");
                if(closestCard !== null){
                    board.insertBefore(flyingCard, closestCard);
                }else{
                    board.appendChild(flyingCard);
                }
            countAllTasks();
        })
    })
}
handleDropzone(allBoards);

function addBoard(){
    let boardName = prompt("Enter new Board name").trim();
    let isPresent = false;

    if(boardName){
        allBoards.forEach((board) => {
            if(board.id === boardName){
                alert("Two or more boards cannot have the same name.");
                isPresent = true;
            }
        })
        if(!isPresent){
            const board = document.createElement("div");
            board.classList.add("board");
            board.id = `${boardName}`;

            const header = document.createElement("h4");
            header.innerText = board.id;

            const spanElement = document.createElement("span");
            spanElement.classList.add("task-counter");
            spanElement.innerText = "0";
            header.appendChild(spanElement);

            board.appendChild(header);

            const addTaskBtn = document.createElement("button");
            addTaskBtn.classList.add("addBtn");
            addTaskBtn.innerText = "Add Task";
            board.appendChild(addTaskBtn);
            addTaskBtn.addEventListener("click", () => {addBtn(`${board.id}`)});

            document.getElementById("container").appendChild(board);
            allBoards = document.querySelectorAll(".board");
            handleDropzone(allBoards);
            updateLocalStorage();
        }
    }else{
        alert("Board name cannot be empty")
    }
}

function addBtn(columnID){
    const boardElement = document.getElementById(`${columnID}`);
    let input = prompt("Enter Task name: ").trim();
    addCard(boardElement, input);
    countAllTasks();
    updateLocalStorage();
}

function addCard(board, input){
    if(input === ""){
        alert("Please provide a valid input.")
    }else if(input !== "" && input ){
        const newCard = document.createElement("div");
        newCard.innerText = input;
        newCard.classList.add("card");
        newCard.draggable = true;
        createFlyingCard(newCard);
        board.appendChild(newCard);
        editCard(newCard);
        delCard(newCard);
    }
}

function editCard(newCard){
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("editBtn");
    newCard.appendChild(editBtn);
    editBtn.addEventListener("click", () => {
    let val = prompt("Enter edit value:").trim();
        if(val && val !== ""){
            const parent = editBtn.parentElement;
            editBtn.parentElement.innerText =  val;
            parent.appendChild(editBtn);
            delCard(newCard);
            updateLocalStorage();
        }
        
    })
}

function delCard(newCard){
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("delBtn");
    newCard.appendChild(delBtn);
    delBtn.addEventListener("click", () => {
        delBtn.parentElement.parentElement.removeChild(delBtn.parentElement);
        countAllTasks();
        updateLocalStorage();
    })
}

function countAllTasks() {
    const taskCounter = document.querySelectorAll(".task-counter");
    taskCounter.forEach((counter) => {
        let parent = counter.parentElement.parentElement;
        counter.textContent = String(parent.children.length - 2);
    })
}

function createFlyingCard (draggableCard){
    draggableCard.addEventListener("dragstart", () => {
        draggableCard.classList.add("flying");
    })
    draggableCard.addEventListener("dragend", () => {
        draggableCard.classList.remove("flying");
        updateLocalStorage();
    })
}

function findClosestCard(container, Ypos){
    const NonFlyingCards = [...container.querySelectorAll(".card:not(.flying)")];
    const value = NonFlyingCards.reduce((closest, childCard) => {
        const childCardBox = childCard.getBoundingClientRect();
        const offset = Ypos - childCardBox.top - (childCardBox.height / 2);
        if(offset < 0 && offset > closest.offset2)
            return {offset2: offset, cardElement: childCard}
        else
            return closest;
    }, {offset2: Number.NEGATIVE_INFINITY})
    return value.cardElement;
}

function updateLocalStorage(){
    const storeData = {};
    allBoards.forEach((board) => {
        const columnID = board.id;
        const cardArr = [...board.querySelectorAll(".card")];
        const taskTextArr = cardArr.map((card) => card.childNodes[0].data);
        storeData[columnID] = taskTextArr;
    })
    localStorage.setItem("kanbanBoard", JSON.stringify(storeData));
}

function loadFromLocalStorage(){
    const savedData = JSON.parse(localStorage.getItem("kanbanBoard")) || {};
    allBoards.forEach((board) => {
        const columnID = board.id;
        if(savedData[columnID]){
            savedData[columnID].forEach((taskText) => {
                addCard(board, taskText);
            })
        }
    })
    countAllTasks();
}

let isDark = true;
function toggleTheme() {
    const lightTheme = document.getElementById('lightTheme');
    const darkTheme = document.getElementById('darkTheme');

    if (isDark) {
        lightTheme.disabled = false;
        darkTheme.disabled = true;
        isDark = false;
        document.getElementById("dark-mode-toggle").innerText = "Dark Mode";
    } else {
        lightTheme.disabled = true;
        darkTheme.disabled = false;
        isDark = true;
        document.getElementById("dark-mode-toggle").innerText = "Light Mode";
    }
}
