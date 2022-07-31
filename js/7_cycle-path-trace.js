// cycle_sr -> starting row of cycle
// cycle_sc -> Starting col of cycle
async function cyclePathTrace(graph, cycle_sr, cycle_sc) {
    let vis = []; // visited array -> to trace visited mark
    let path = []; // path array -> To trace stack
    for(let r = 0; r < rows; r++) {
        let visRow = [];
        let pathRow = [];
        for(let c = 0; c < cols; c++) {
            visRow.push(false);
            pathRow.push(false);
        }
        vis.push(visRow);
        path.push(pathRow);
    }


    // Recursion
    let response = await cyclePathTrace_dfs(graph, cycle_sr, cycle_sc, vis, path);
    if(response === true) 
        return Promise.resolve(true);;
    
    return Promise.resolve(false);;
}

function colorDelay() {
    return new Promise((resolve, reject) => {
        setTimeout((e) => {
            resolve();
        }, 500);
    })
}

async function cyclePathTrace_dfs(graph, sr, sc, vis, path) {
    // Mark vis and path as true
    vis[sr][sc] = true;
    path[sr][sc] = true;
    
    let cell = document.querySelector(`.cell[rid="${sr}"][cid="${sc}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorDelay(); // delay for 1sec
    
    let isCyclceDetect = false;
    for(let childIdx = 0; childIdx < graph[sr][sc].length; childIdx++) {
        let [nbr_row, nbr_col] = graph[sr][sc][childIdx];
        
        if(vis[nbr_row][nbr_col] === false) {
            isCyclceDetect = isCyclceDetect || await cyclePathTrace_dfs(graph, nbr_row, nbr_col, vis, path);
        } else if(vis[nbr_row][nbr_col] === true && path[nbr_row][nbr_col] === true) {
            let cyclicCell = document.querySelector(`.cell[rid="${nbr_row}"][cid="${nbr_col}"]`);
            cyclicCell.style.backgroundColor = "pink";
            await colorDelay(); // delay for 1sec

            cyclicCell.style.backgroundColor = "transparent";
            await colorDelay(); // delay for 1sec

            await colorDelay(); // delay for 1sec
            cell.style.backgroundColor = "transparent";
            return Promise.resolve(true);
        }
    }

    // mark path as false (BackTrack)
    path[sr][sc] = false;
    
    await colorDelay(); // delay for 1sec
    cell.style.backgroundColor = "transparent";
    
    return Promise.resolve(isCyclceDetect);
}