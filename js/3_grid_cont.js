let rows = 100;
let cols = 26;

let addresColCont = document.querySelector(".address-col-cont");
let addresRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

for(let i = 0; i < rows; i++) {
    let addresCol = document.createElement("div");
    addresCol.setAttribute("class", "address-col");
    addresCol.innerText = i + 1;
    addresColCont.appendChild(addresCol);
}

for(let i = 0; i < cols; i++) {
    let addresRow = document.createElement("div");
    addresRow.setAttribute("class", "address-row");
    addresRow.innerText = String.fromCharCode(i + 65);
    addresRowCont.appendChild(addresRow);
}

for(let r = 0; r < rows; r++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont"); 
    for(let c = 0; c < cols; c++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell1");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");
        

        // create input tag
        let input = document.createElement("input");
        input.setAttribute("class", "cell");
        input.setAttribute("type", "text");


        // Atributes for cell and storage identification
        input.setAttribute("rid", r)
        input.setAttribute("cid", c)
        cell.appendChild(input);

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(input, r, c);
    }
    cellsCont.appendChild(rowCont);
}

function addListenerForAddressBarDisplay(cell, r, c) {
    cell.addEventListener("click", (e) => {
        let rowID = r + 1;
        let colID = String.fromCharCode(c + 65);
        addressBar.value = `${colID}${rowID}`;
    })
}