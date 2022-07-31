let ctrBtnFlag;
let copy = document.querySelector(".copy");
let cut = document.querySelector(".cut");
let paste = document.querySelector(".paste");

let rangeStorage = []; // stored range in the form of (rid,cid)
let copyCutData = []; // stored copy and cut data

// pressed ctrl key
document.addEventListener("keydown", (e) => {
    ctrBtnFlag = e.ctrlKey; // true
})

// ctrl key up
document.addEventListener("keyup", (e) => {
    ctrBtnFlag = e.ctrlKey; // false
})


for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`); 
        cell.addEventListener("click", (e) => {
            handleSelectedCell(cell);
        })
    }
}

function handleSelectedCell(cell) {
    if(!ctrBtnFlag) return;

    let rid = Number(cell.getAttribute("rid")); // get rid
    let cid = Number(cell.getAttribute("cid")); // get cid

    if(rangeStorage.length >= 2) {
        // getDefaultSeletedCell();
        removeSelectedRangeUI();
        rangeStorage = []; // make rangeStorage to empty
    }
    rangeStorage.push([rid, cid]); // store (rid,cid) in a storage array

    // UI
    cell.style.border = "2px solid #2f3640"; 

    if(rangeStorage.length == 2) {
        getDefaultSeletedCell();
        handleSelectedRangeUI();
    }
}

function getDefaultSeletedCell() {
    for(let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`); 
        cell.style.border = "1px solid #afbac7";
    }
}

function handleSelectedRangeUI() {
    let [stRow, stCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    console.log([stRow, stCol, endRow, endCol]);
    // top border
    for(let r = stRow, c = stCol; c <= endCol; c++) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderTop = "2px solid #2f3640";
    }

    // right border
    for(let r = stRow, c = endCol; r <= endRow; r++) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderRight = "2px solid #2f3640";
    }

    // bottom border
    for(let r = endRow, c = endCol; c >= stCol; c--) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderBottom = "2px solid #2f3640";
    }

    // left border
    for(let r = endRow, c = stCol; r >= stRow; r--) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderLeft = "2px solid #2f3640";
    }

}

function removeSelectedRangeUI() {
    let [stRow, stCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    
    // top border
    for(let r = stRow, c = stCol; c <= endCol; c++) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderTop = "1px solid #afbac7";
    }

    // right border
    for(let r = stRow, c = endCol; r <= endRow; r++) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderRight = "1px solid #afbac7";
    }

    // bottom border
    for(let r = endRow, c = endCol; c >= stCol; c--) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderBottom = "1px solid #afbac7";
    }

    // left border
    for(let r = endRow, c = stCol; r >= stRow; r--) {
        let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
        cell.style.borderLeft = "1px solid #afbac7";
    }
}

// add click listener to copyBtn to perform copy work
copy.addEventListener("click", (e) => {
    if(rangeStorage < 2) return;
    copyCutData = [];

    // get row and col from range storage array
    let [stRow, stCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for(let r = stRow; r <= endRow; r++) {
        let row = [];
        for(let c = stCol; c <= endCol; c++) {
            let cellProp = sheetDB[r][c];
            row.push(cellProp);
        }
        copyCutData.push(row);
    } 
    // getDefaultSeletedCell();
    removeSelectedRangeUI();
})

// add click listener to cutBtn to perform cut work
cut.addEventListener("click", (e) => {
    if(rangeStorage.length < 2) return;
    copyCutData = [];

    let [stRow, stCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for(let r = stRow; r <= endRow; r++) {
        let row = [];
        for(let c = stCol; c <= endCol; c++) {
            let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 

            let cellProp = sheetDB[r][c];
            let newSheetDB = {
                bold: cellProp.bold,
                italic: cellProp.italic,
                underline: cellProp.underline,
                alignment: cellProp.alignment,
                fontFamily: cellProp.fontFamily,
                fontSize: cellProp.fondSize,
                fontColor: cellProp.fontColor,
                BGcolor: cellProp.BGcolor,  
                value: cellProp.value
            }
            row.push(newSheetDB);
            
            // Erase data from sheetDB
            // DB
            cellProp.value = "";
            cellProp.fontFamily = "monospace";
            cellProp.fondSize = "14";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.alignment = "left";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";

            // UI
            cell.click();
        }
        copyCutData.push(row);
    } 
    // getDefaultSeletedCell();
    removeSelectedRangeUI();
})

paste.addEventListener("click", (e) => {
    if(rangeStorage < 2) return;

    let address = addressBar.value; // D5
    let [stRow, stCol] = decodeRIDCIDFromAddress(address); // [4, 3]
    let [rowDiff, colDiff] = [Math.abs(rangeStorage[0][0] - rangeStorage[1][0]), Math.abs(rangeStorage[0][1] - rangeStorage[1][1])];

    // i -> refers copyCutData row
    // j -> refers copyCutData col
    for(let r = stRow, i = 0; r <= stRow + rowDiff; r++, i++) {
        for(let c = stCol, j = 0; c <= stCol + colDiff; c++, j++) {
            let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`); 
            if(!cell) continue;

            let cellProp = sheetDB[r][c];
            let sheetData = copyCutData[i][j];

            // DB
            cellProp.value = sheetData.value;
            cellProp.fontFamily = sheetData.fontFamily;
            cellProp.fondSize = sheetData.fontSize;
            cellProp.bold = sheetData.bold;
            cellProp.italic = sheetData.italic;
            cellProp.underline = sheetData.underline;
            cellProp.alignment = sheetData.alignment;
            cellProp.fontColor = sheetData.fontColor;
            cellProp.BGcolor = sheetData.BGcolor;

            // UI
            cell.click();
        }
    }
})

