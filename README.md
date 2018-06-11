# Mars-Rover-Code

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Martian_rover_Curiosity_using_ChemCam_Msl20111115_PIA14760_MSL_PIcture-3-br2.jpg/1200px-Martian_rover_Curiosity_using_ChemCam_Msl20111115_PIA14760_MSL_PIcture-3-br2.jpg)


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
