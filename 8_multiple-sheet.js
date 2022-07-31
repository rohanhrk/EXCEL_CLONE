let addBtn = document.querySelector(".sheet-add-icon");
let sheetFolderCont = document.querySelector(".sheets-folder-cont");
addBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);
    sheet.innerHTML = `
        <div class="sheet-content">sheet ${allSheetFolders.length + 1}</div>
    `
    sheetFolderCont.appendChild(sheet);

    // create sheet db
    createSheetDB();

    // create graph component
    createGraphComponent();

    // handle active sheet
    handleActiveSheet(sheet);

    // handle sheet remove
    handleSheetRemove(sheet);

    // sheet active
    sheet.click();
});

function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000",  // Just for indication purpose,
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponent() {
    let graph = [];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < rows; c++) {
            let col = [];
            row.push(col);
        }
        graph.push(row);
    }
    collectedGraphComponent.push(graph);
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graph = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties(sheet) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}
function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#bdc3c7";
    sheet.style.borderRadius = "5px";
}
function handleActiveSheet(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));

        // handle storage -> sheet DB and graph DB
        handleSheetDB(sheetIdx);

        // haandle sheet property
        handleSheetProperties(sheet);

        // handle UI
        handleSheetUI(sheet);
    })
}

function handleSheetRemovalUI(sheet) {
    sheet.remove();
  
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }


    allSheetFolders[0].style.backgroundColor = "#bdc3c7";
}
function handleSheetRemove(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        let button = e.button;
        if (button != 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length == 1) {
            alert("You need to have atleast one sheet!!!");
            return;
        }

        let response = confirm("sheet will be permanently remove from data base, are you sure to remove???");
        if(response === false) return;

        // DB
        let sheetIdx = Number(sheet.getAttribute("id"));
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);

        // UI
        handleSheetRemovalUI(sheet);

        // By default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
}