# Mars-Rover-Code

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Martian_rover_Curiosity_using_ChemCam_Msl20111115_PIA14760_MSL_PIcture-3-br2.jpg/1200px-Martian_rover_Curiosity_using_ChemCam_Msl20111115_PIA14760_MSL_PIcture-3-br2.jpg)



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

1. https://en.wikipedia.org/wiki/A*_search_algorithm
2. https://en.wikipedia.org/wiki/Dijkstra's_algorithm



## My solution


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

