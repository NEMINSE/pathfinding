import React, {Component} from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import {dijkstra,getNodesInShortestPathOrder} from '../Algorithms/dijkstra';

const start_node_row = 10;
const start_node_col = 15;
const finish_node_row = 10;
const finish_node_col = 35;

export default class PathfindingVisualizer extends Component{
    constructor(){
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }
     componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }
    handleMouseDown(row, col){
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col){
        if(!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUo() {
        this.setState({mouseIsPressed: false});
    }

    animatedDijkstra(visitedNodesInOrder,getNodesInShortestPathOrder){
        for(let i=0; i <= visitedNodesInOrder.length; i++){
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(getNodesInShortestPathOrder);
                }, 10 * i)
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited';
            },10 * i);
        }
    }

    animateShortestPath(getNodesInShortestPathOrder){
        for(let i = 0; i < getNodesInShortestPathOrder.length; i++){
            setTimeout(() => {
                const node = getNodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            },50 * i);
        }
    }

    visualizeDijkstra(){
        const {grid} = this.state;
        const startNode = grid[start_node_row][start_node_col];
        const finishNode = grid[finish_node_row][finish_node_row];
        const visitedNodesInOrder = dijkstra(grid,startNode,finishNode)
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animatedDijkstra(visitedNodesInOrder,nodesInShortestPathOrder);
    }

    render(){
        const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUo()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for(let col = 0; col <50;col++){
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) =>{
    return {
        col,
        row,
        isStart: row === start_node_row && col === start_node_col,
        isFinish: row === finish_node_row && col === finish_node_col,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid,row,col) =>{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}