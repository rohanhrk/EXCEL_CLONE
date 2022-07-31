// listener to all cell to set value
for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value; // get address name 
            let [cell, cellProp] = getCellAndCellProp(address); // get cell and sheetDB access
            let enteredData = cell.innerText; // UI Change(cell)

            // case 2 / case 3(a) 
            // => if value changed, break Parent-child relationship 
            // and update value in children cell also
            if(cellProp.value != "" && enteredData != cellProp.value) {
                // 2.1.1 / 3.1.1 
                cellProp.value = enteredData; // DB change
                
                // 3.1.2
                removeChildFromParent(address); // remove myself(child) from parent DB 
                
                // 2.1.2 , 3.1.2
                updateChildrenCell(address); // update children cell
                
                // 2.1.3 / 3.1.3
                cellProp.formula = ""; // remove old formula 
                
                return;
            }

            cellProp.value = enteredData; // DB change
        })
    }
}

// listenter to formula bar to evaluate formula entered 
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
    let inputFormula = formulaBar.value; // get the formula -> ( A1 + A2 )
    if(e.key === "Enter" && inputFormula) {
        // case 1 (cell dependancy) =>
        let address = addressBar.value; // get address name 
        let [cell, cellProp] = getCellAndCellProp(address); // get cell and cellProp
        
        // Case 3(b)
        // If formula changed, remove Parent-children relationship
        // update value in children cell
        if(inputFormula != cellProp.formula) {
            // 3.2.1
            removeChildFromParent(address); // remove myself(child) from parent DB
        }

        
        // 📌CYCLE DETECT (USING GRAPH ALGORITH) 📌
        addEdgesInGraph(inputFormula, address); // add edges in a graph (parent -> children)
        // True => not safe , false => safe
        let cycleRespone = isSafeTOEnterFormula(graph);
        if(cycleRespone) {
            let [cycle_sr, cycle_sc] = cycleRespone;
            let response = confirm("Formula is form a cycle. Do you want to trace this cycle??");
            while(response === true) {
                // color trace
                await cyclePathTrace(graph, cycle_sr, cycle_sc);
                response = confirm("Entered Formula is cyclic. Do you want to trace cycle");
            }
            removeEdgeFromGraph(inputFormula);
            return;
        }
        
        // case 1
        // 1.1.1 / 3.2.2
        let evaluatedValue = evaluateFormula(inputFormula); // Evaluate the formula -> get value
       
        // 1.1.2 / 3.2.3 
        setCellUIAndCellProp(evaluatedValue, inputFormula); //To update UI and cellProp in DB
        
        // 1.1.3 / 3.2.4
        addChildToParent(inputFormula); // add yourself(child) to parent

        // 1.1.4 / 3.2.5
        formulaBar.value = ""; // set formula bar to default

        // 1.1.5 / 3.2.6    
        updateChildrenCell(address); // also update children cell
    }

})


// ==========================================_FUNCTION_==========================================
function addEdgesInGraph(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let formulaArr = formula.split(" ");
    formulaArr.forEach((elem) => {
        let ch = elem.charAt(0);
        if(ch >= 'A' && ch <= 'Z') {
            let [prid, pcid] = decodeRIDCIDFromAddress(elem);
            graph[prid][pcid].push([crid, ccid]); // directed graph
        }
    })
}

function removeEdgeFromGraph(formula) {
    let formulaArr = formula.split(" ");
    formulaArr.forEach((elem) => {
        let ch = elem.charAt(0);
        if(ch >= 'A' && ch <= 'Z') {
            let [prid, pcid] = decodeRIDCIDFromAddress(elem);
            graph[prid][pcid].pop();
        }
    })
}
function removeChildFromParent(childAddress) {
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let formula = childCellProp.formula;// get formula from children DB
    let formulaArr = formula.split(" ");
    for(let i = 0; i < formulaArr.length; i++) {
        let ch = formulaArr[i].charAt(0);
        // check ch is valid or not
        if(ch >= 'A' && ch <= 'Z') {
            // work
            // find required child from parent and remove it from parent
            let [parentCell, parentCellProp] = getCellAndCellProp(formulaArr[i]);
            let index = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(index, 1);
        }
    }
}
function updateChildrenCell(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let childrenArr = parentCellProp.children;
    for(let i = 0; i < childrenArr.length; i++) {
        let childrenAddress = childrenArr[i]; // get children address
        let [childCell, childCellProp] = getCellAndCellProp(childrenAddress); // get child cell and DB
        let evaluateValue = evaluateFormula(childCellProp.formula); // re evaluate formlua

        // to update UI and DB
        childCell.innerText = evaluateValue; // UI update

        childCellProp.value = evaluateValue; // DB update

        // recursion
        updateChildrenCell(childrenAddress);
    }
} 
function evaluateFormula(formula) {
    // ( A1 + A2 )
    // split string with respet to space(" ")
    let formulaArr = formula.split(" "); // ["(", "A1", "+", "A2", ")"]
    for(let i = 0; i < formulaArr.length; i++) {
        let asciiValue = formulaArr[i].charCodeAt(0); // A1 ->  A -> 65

        // check ascii value is valid or not
        if(asciiValue >= 65 && asciiValue <= 90) {
            let value = getValue(formulaArr[i]); // get the value of address
            formulaArr[i] =  value;
        }
    }

    // ["(", "10", "+", "10", ")"]
    let newFormula = formulaArr.join(" "); // ( 10 + 10 )
    return eval(newFormula); // 20
}

function getValue(elem) {
    let [cell, cellProp] = getCellAndCellProp(elem);
    let value = cellProp.value;
    return value;
}
function addChildToParent(inputFormula) {
    let formulaArr = inputFormula.split(" ");
    for(let i = 0; i < formulaArr.length; i++) {
        let ch = formulaArr[i].charAt(0);

        // check character is valid or not
        if(ch >= 'A' && ch <= 'Z') {
            let childAddress = addressBar.value;
            let [cell, cellProp] = getCellAndCellProp(formulaArr[i]);
            cellProp.children.push(childAddress);
        }
    }
}

function setCellUIAndCellProp(evaluatedValue, formula) {
    let address = addressBar.value; // get address name from address bar
    let [cell, cellProp] = getCellAndCellProp(address); // get cell and sheetDB access

    // UI update
    cell.innerText = evaluatedValue; // set value

    // DB update
    cellProp.value = evaluatedValue; // set value
    cellProp.formula = formula; // set formula
}
