// Create Graph -> 2D array
let collectedGraphComponent = []; // contains all the graph
let graph = [];

// True -> Not safe, False -> safe
function isSafeTOEnterFormula(graph) {
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
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            if(vis[r][c] === false) {
                let isCyclceDetect = dfs(graph, r, c, vis, path);
                if(isCyclceDetect === true)
                    return [r, c];
            }
        }
    }

    return null;
}

// function for detect cycle in a graph
function dfs(graph, sr, sc, vis, path) {
    // Mark vis and path as true
    vis[sr][sc] = true;
    path[sr][sc] = true;
    
    let isCyclceDetect = false;
    for(let childIdx = 0; childIdx < graph[sr][sc].length; childIdx++) {
        let [nbr_row, nbr_col] = graph[sr][sc][childIdx];
        
        if(vis[nbr_row][nbr_col] === false) {
            isCyclceDetect = isCyclceDetect || dfs(graph, nbr_row, nbr_col, vis, path);
        } else if(vis[nbr_row][nbr_col] === true && path[nbr_row][nbr_col] === true) {
            return true;
        }
    }

    // mark path as false (BackTrack)
    path[sr][sc] = false;

    return isCyclceDetect;
}