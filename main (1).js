/*
Mars Rover

Build an API to navigate a rover along a topographical grid representation of Mars.

Requirements


The rover when initialized will have an initial starting point (x, y) as well as a direction (N, S, E, W) that it is facing.
The rover should recieve its commands as a string array. It should then iterate over the array executing the commands in sequence until either a) all commands have succeeded in which case 
return a OK status along with location and direction or b) a command failed due to an obstacle in which case return an OBSTACLE status code along with last successful location and direction
If the rover recieves invalid commands immediatly an INVALID_COMMAND status along with location and direction of the last successful command
The rover may move forward/backward with the (F, B) commands
The rover may turn left and right with the (L, R) commands
If the rover encounters obstacles in the terrain then it should return its last successfull location as well as a OBSTACLE status
If the rover encounters the edge of the world it should stop and return its last successfull location as well as a OBSTACLE status

Instructions


ES2015 is supported feel free to use it or use ES5
Feel free to modify any code you wish to suit your preference. Also, don't feel limited to methods provided feel free add more (encouraged)
If you modify Exersize code (i.e use funtional instead of class based Rover) you'll need to modify the tests accordingly
Read the tests! They have helpful in better understanding the requirements

Extra Credit


add a moveTo() method that takes the (x,y) coordinates to move the rover along the most optimal path bypassing obstacles
https://en.wikipedia.org/wiki/A*_search_algorithm
https://en.wikipedia.org/wiki/Dijkstra's_algorithm
*/
const TERRAIN_TYPES = {
    'P': {
        obstacle: false,
        description: 'plains'
    },
    'M': {
        obstacle: true,
        description: 'mountains'
    },
    'C': {
        obstacle: true,
        description: 'crevasse'
    }
};

const STATUS_CODES = ['OK', 'OBSTACLE', 'INVALID_COMMAND'];

// top left corner is (X:0, Y:0)
// bottom right is (X:4, Y:4)
const WORLD = [
    ['P', 'P', 'P', 'C', 'P'],
    ['P', 'M', 'P', 'C', 'P'],
    ['P', 'M', 'P', 'C', 'P'],
    ['P', 'M', 'P', 'P', 'P'],
    ['P', 'M', 'P', 'P', 'P']
];

const DIRECTIONS = ['N', 'S', 'E', 'W'];
const COMMANDS = ['L', 'R', 'F', 'B'];

// Start: Exersize Code (Your Code)

// YOUR CODE BELOW
// NOTE: cntrl + enter to run tests
// Note: integrated firebug for console logs

/**
 * FIRST PART
 * 1. First, the location and direction properties are assigned in the constructor using the values from the parameters.
 * 2. The command method is split in multiple parts
 *      a. The commands input array is iterated until an obstacle or the edge of the world or until all commands execute succesfully
 *      b. To check if a command is valid, the indexOf method is used along with the COMMANDS constant array. If the method returns -1 then the
 *          command is invalid.
 *      c. If the command was valid, the program attemps to execute the command. In the attempCommand method it executes the action the command describes,
 *          if the command is to turn left or right, it will always be successful. If the command is to move forwards or backwards then a check will be made
 *          to see if the rober will end up inside an obstacle or outside of the world.
 *      d. If the move command was succesfull, update the location
 *      e. If the attempCommand method was succesful then the program moves onto the next command and repeats steps b to d until it finishes iterating
 * EXTRA CREDIT
 * 1. First, create an adjacency list that represents a graph with the WORLD array to later execute the dijkstra algorithm
 *      a. Each position in the WORLD array is iterated, if the position isn't an obstacle then it is considerated a node of the graph. This is done in order to avoid obstacles
 *          in the optimal path.
 *      b. The currentNode (the starting point of the algorithm) is set when a posotion that matches the initial position of the rover is found
 * 2. The dijkstra algorithm begins with creating 3 arrays to store the distance, the visited nodes and the previous node for each node of the graph
 *      a. The source node is used to set the initial values
 *      b. Iterate the neighbours to search for the one with minimal distance, if the neighbour matches the destination x and y values then stop the algorithm
 *      c. If the destination isnt found yet, evaluate the node neighbours to continue building all posible paths
 *      d. When the destination is found, build the sequential path by iterating the previous array
 * 3. When the path is obtained from the dijkstra algorithm, iterate the path and use the information of the next location in the path to determine where should the rover move next
 *      a. Determine if it should move north, south, west or east
 *      b. Use the command method defined earlier, turn left or right if it is necessary to reach the next location in the path. The rover always moves forwards
 */

class Rover {
    constructor(location, direction) {

        // Initialize properties with values from input parameters
        this.location = location;
        this.direction = direction;
    }
    command(commands) {

        this.commands = commands;
        let status = null;

        // Iterate input command array until an invalid command is found, an obstacle is found or until the last command
        for (let i = 0; i < commands.length && !status; i++) {

            // Check if the command is valid
            if (this.checkValidity(commands[i])) {

                // If command is valid, attemp to execute command
                if (!this.attempCommand(commands[i])) {

                    // If command didn't result in a valid location, create status with obstacle
                    status = new Status(STATUS_CODES[1], this.location, this.direction);
                }
            }
            else {
                // If command is invalid, create status with invalid command
                status = new Status(STATUS_CODES[2], this.location, this.direction);
            }
        }

        // If all commands executed succesfully, return OK status
        if (!status)
            status = new Status(STATUS_CODES[0], this.location, this.direction);

        return status;
    }
    checkValidity(command) {
        // Search valid commands array for input command, if not found then the input command is invalid
        if (COMMANDS.indexOf(command) === -1) {
            // The command is invalid
            return false
        }
        else
            return true
    }
    attempCommand(command) {
        let success = true;
        switch (command) {
            // Turn, always a succesful command
            case 'R':
            case 'L':
                this.changeDirection(command);
                break;
            // Attempt to move Forwards or Backwards
            default:
                success = this.move(command);
                break;
        }
        // returns whenever the command was succesful or not
        return success;
    }
    changeDirection(turnDirection) {
        // Assign new direction depending on the current direction and the input turn direction
        switch (this.direction) {
            // North
            case 'N':
                if (turnDirection === 'L')
                    this.direction = 'W';
                else
                    this.direction = 'E';
                break;
            // South
            case 'S':
                if (turnDirection === 'L')
                    this.direction = 'E';
                else
                    this.direction = 'W';
                break;
            // East
            case 'E':
                if (turnDirection === 'L')
                    this.direction = 'N';
                else
                    this.direction = 'S';
                break;
            // West
            default:
                if (turnDirection === 'L')
                    this.direction = 'S';
                else
                    this.direction = 'N';
                break;
        }
    }
    move(moveDirection) {
        let newLocation = [];
        // Sets the potential new location depending on the current direction and the input move direction
        switch (this.direction) {
            // North
            case 'N':
                if (moveDirection === 'F') {
                    newLocation = [this.location[0], this.location[1] - 1]
                }
                else {
                    newLocation = [this.location[0], this.location[1] + 1]
                }
                break;
            // South
            case 'S':
                if (moveDirection === 'F') {
                    newLocation = [this.location[0], this.location[1] + 1]
                }
                else {
                    newLocation = [this.location[0], this.location[1] - 1]
                }
                break;
            // East
            case 'E':
                if (moveDirection === 'F') {
                    newLocation = [this.location[0] + 1, this.location[1]]
                }
                else {
                    newLocation = [this.location[0] - 1, this.location[1]]
                }
                break;
            // West
            default:
                if (moveDirection === 'F') {
                    newLocation = [this.location[0] - 1, this.location[1]]
                }
                else {
                    newLocation = [this.location[0] + 1, this.location[1]]
                }
                break;
        }

        // Check if the new location is past the edge of the world
        if (newLocation[0] < 0 || newLocation[0] > 4 || newLocation[1] < 0 || newLocation[1] > 4)
            return false;

        // Check if the rover met an obstacle
        const newLocationTerrain = WORLD[newLocation[1]][newLocation[0]];
        if (TERRAIN_TYPES[newLocationTerrain].obstacle === true) {
            return false;
        }



        // If no obstacle and no edge of the world was met, then set the newLocation the location property of the rover
        // and inform the move command was a success
        else {
            this.location = newLocation;
            return true
        }
    }
    moveTo(x, y) {

        // Build an adjacency list that represents the graph
        let graphAndNode = this.createGraph();
        // Find the optimal path using the dijkstra algorithm
        let path = this.dijkstra(graphAndNode[0], graphAndNode[1], [x, y]);
        // Executes the path
        this.executePath(path);
    }

    createGraph() {
        let graph = [];
        let currentNode = null;
        // Creates an adjacency list using each position as a node, ignoring obstacles
        for (let i = 0; i < WORLD.length; i++) {
            let row = WORLD[i];
            for (let j = 0; j < row.length; j++) {
                // If terrain is not obstacle or out of bounds then a node can be considered adjacent to the current one
                if (TERRAIN_TYPES[WORLD[i][j]].obstacle === false) {
                    let nodeAdjacentList = [];
                    if (i + 1 <= 4)
                        if (TERRAIN_TYPES[WORLD[i + 1][j]].obstacle === false)
                            nodeAdjacentList.push([i + 1, j]);

                    if (j + 1 <= 4)
                        if (TERRAIN_TYPES[WORLD[i][j + 1]].obstacle === false)
                            nodeAdjacentList.push([i, j + 1]);

                    if (i - 1 >= 0)
                        if (TERRAIN_TYPES[WORLD[i - 1][j]].obstacle === false)
                            nodeAdjacentList.push([i - 1, j]);

                    if (j - 1 >= 0)
                        if (TERRAIN_TYPES[WORLD[i][j - 1]].obstacle === false)
                            nodeAdjacentList.push([i, j - 1]);

                    let node = new Node([i, j], nodeAdjacentList);
                    if (i === this.location[0] && j === this.location[1])
                    // If node is same as source node then, set it as current node
                        currentNode = node;

                    graph.push(node);
                }
            }
        }
        return [graph, currentNode];
    }

    // Dijkstra algorithm implementation
    dijkstra(graph, sourceNode, destination) {
        let distances = [];
        let previous = [];
        let visited = [];
        let currentNode = null;

        // Finds minimun distance
        for (let i = 0; i < graph.length; i++) {
            distances.push(99999);
            previous.push[null];
            visited.push(false);
        }
        let sourceIndex = this.searchInList(sourceNode.location, graph);
        distances[sourceIndex] = 0;
        let found = false;
        // Evaluate all nodes until destination is found
        while (!this.allVisited(visited) && !found) {
            // Get the node with the minimun distance
            let minDist = 999;
            let minDistNodeIndex = -1;
            for (let i = 0; i < distances.length; i++) {
                const nodeDistance = distances[i];
                // If the node has less distance value and hasn't been visited yet, then set it as the current node
                if (nodeDistance < minDist && visited[i] === false) {
                    minDist = nodeDistance;
                    minDistNodeIndex = i;
                }
            }

            currentNode = graph[minDistNodeIndex];
            visited[minDistNodeIndex] = true;
            if (currentNode.location[0] === destination[0] && currentNode.location[1] === destination[1])
                found = true;
            else {
                // Evaluates for a minimum distance
                for (let i = 0; i < currentNode.adjacentList.length; i++) {
                    const neighborNodeLocation = currentNode.adjacentList[i];
                    const neighborIndex = this.searchInList(neighborNodeLocation, graph);
                    if (neighborIndex > -1) {
                        let newDist = distances[minDistNodeIndex] + 1;
                        let neighborDistance = distances[neighborIndex];
                        if (newDist < neighborDistance) {
                            distances[neighborIndex] = newDist;
                            previous[neighborIndex] = currentNode;
                        }
                    }
                }
            }
        }
        let path = [];

        // Build reverse optimal path
        while (currentNode) {
            path.push(currentNode);
            let indexCurrentPush = this.searchInList(currentNode.location, graph);
            currentNode = previous[indexCurrentPush];
            if (currentNode && currentNode.location[0] === sourceNode.location[0] && currentNode.location[1] === sourceNode.location[1]) {
                path.push(currentNode);
                currentNode = null;
            }
        }
        return path;
    }

    // Search a spceific node in the list by its location
    searchInList(nodeLoc, list) {
        for (let i = 0; i < list.length; i++) {
            const listNode = list[i];
            if (listNode.location[0] === nodeLoc[0] && listNode.location[1] === nodeLoc[1]) {
                return i;
            }
        }
        return -1;

    }

    allVisited(visitedarray) {
        // Method that determines if all nodes were visited
        for (let i = 0; i < visitedarray.length; i++) {
            if (visitedarray[i] === false)
                return false;
        }
        return true;
    }

    // Moves the rover and prints the commands it executed to reach its destination
    executePath(path) {
        let commands = [];
        for (let i = path.length - 1; i > 0; i--) {
            const currentPathNode = path[i];
            const nextPathNode = path[i - 1];
            // Views the next location and then executes a set of commands to reach that location
            switch (this.getNextMovementDirection(currentPathNode.location, nextPathNode.location)) {
                case 'N':
                    if (this.direction === 'N') {
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'W') {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'E') {
                        commands.push('L');
                        this.command(['L']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    break;
                case 'S':
                    if (this.direction === 'N') {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'W') {
                        commands.push('L');
                        this.command(['L']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'E') {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else {
                        commands.push('F');
                        this.command(['F']);
                    }
                    break;
                case 'W':
                    if (this.direction === 'N') {
                        commands.push('L');
                        this.command(['L']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'W') {
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'E') {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    break;
                default:
                    if (this.direction === 'N') {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'W') {
                        commands.push('R');
                        this.command(['R']);
                        commands.push('R');
                        this.command(['R']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    else if (this.direction === 'E') {
                        commands.push('F');
                        this.command(['F']);
                    }
                    else {
                        commands.push('L');
                        this.command(['L']);
                        commands.push('F');
                        this.command(['F']);
                    }
                    break;
            }

        }
        console.log(commands);
        return commands;
    }

    getNextMovementDirection(firstLocation, secondLocation) {
        // Determines what direction the rober needs to move next
        if (firstLocation[0] > secondLocation[0])
            return 'N';
        else if (firstLocation[0] < secondLocation[0])
            return 'S';
        else if (firstLocation[1] > secondLocation[1])
            return 'W';
        else
            return 'E';
    }

}

// Class that represents a status
class Status {
    constructor(status, loc, dir) {
        this.status = status;
        this.loc = loc;
        this.dir = dir;
    }
}

// Class that represents a node for the Djikstra algorithm
class Node {
    constructor(location, adjacentList) {
        this.location = location;
        this.adjacentList = adjacentList;
    }
}

// Test Specs
mocha.setup('bdd');

var expect = chai.expect;

describe('Mars Rover', function () {
    let rover1 = null;
    beforeEach(function () {
        rover1 = new Rover([2, 2], 'N');
    });
    describe('When the Mars Rover is initialized', function () {
        it('should set the starting location', function () {
            expect(rover1.location).to.deep.equal([2, 2]);
        });
        it('should set the starting direction', function () {
            expect(rover1.direction).to.equal('N');
        });
    });
    describe('When the rover recieves commands', function () {
        it('should store the commands', function () {
            rover1.command(['F', 'F', 'B']);
            expect(rover1.commands).to.deep.equal(['F', 'F', 'B']);
        });
        it('should handle invalid commands', function () {
            const status = rover1.command(['X']);

            expect(status).to.deep.equal({
                status: 'INVALID_COMMAND',
                loc: [2, 2],
                dir: 'N'
            });
        });
    });
    describe('When the rover executes valid commands', function () {
        describe('When facing north', function () {
            describe('When moving forward', function () {
                it('should move north one tile', function () {
                    const status = rover1.command(['F']);
                    expect(status).to.deep.equal({
                        status: 'OK',
                        loc: [2, 1],
                        dir: 'N'
                    });
                });
            });
            describe('When moving backward', function () {
                it('should move south one tile', function () {
                    const status = rover1.command(['B']);
                    expect(status).to.deep.equal({
                        status: 'OK',
                        loc: [2, 3],
                        dir: 'N'
                    });
                });
            });
            describe('When turning left', function () {
                it('should be facing west', function () {
                    const status = rover1.command(['L']);
                    expect(status).to.deep.equal({
                        status: 'OK',
                        loc: [2, 2],
                        dir: 'W'
                    });
                });
            });
            describe('When turning right', function () {
                it('should be facing east', function () {
                    const status = rover1.command(['R']);
                    expect(status).to.deep.equal({
                        status: 'OK',
                        loc: [2, 2],
                        dir: 'E'
                    });
                });
            });
        });
    });
    describe('When the rover encounters obstacles', function () {
        describe('When encountering a mountain', function () {
            it('should stop and return status', function () {
                const status = rover1.command(['L', 'F']);
                expect(status).to.deep.equal({
                    status: 'OBSTACLE',
                    loc: [2, 2],
                    dir: 'W'
                });
            });
        });
        describe('When encountering a crevasse', function () {
            it('should stop and return status', function () {
                const status = rover1.command(['F', 'F', 'R', 'F']);
                expect(status).to.deep.equal({
                    status: 'OBSTACLE',
                    loc: [2, 0],
                    dir: 'E'
                });
            });
        })
        describe('When encountering the edge of the world', function () {
            it('should stop and return status', function () {
                const status = rover1.command(['F', 'F', 'F']);
                expect(status).to.deep.equal({
                    status: 'OBSTACLE',
                    loc: [2, 0],
                    dir: 'N'
                });
            });
        });
    });
});

mocha.run();

