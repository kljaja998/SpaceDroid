//import kaboom from "kaboom"
//const kaboom = require("kaboom")

kaboom({
    global: true,
    //fullscreen: true,
    scale: 1,
    debug: true,
    //clearColor: [0, 0, 0, 1],
    background: [0, 0, 0, 1],
    width: 800,
    height: 800,
})

// *************
// GAME SETUP
// *************

let grid_size = 30;
let distance = 5;
let player_size = 15;
let wall_size = 40;
let outline_thickness = 3;
let direction = "LEFT"

function initialize_walls(){
    let walls = [];
    walls.push("=".repeat(grid_size))
    for(let i = 0; i < grid_size - 2; i++){
        walls.push("=" + " ".repeat(grid_size - 2) + "=")
    }
    walls.push("=".repeat(grid_size))
    return walls
}

/*

function fadeIn(speed = 1) {
    let opacity = 0;
    return {
        // runs when object is added to the scene
        add() {
            this.color.a = opacity; // make sure the game object using this component has `color()` component
        },
        // runs every frame when object is still in the scene
        update() {
            if (opacity < 1) {
                opacity += dt() * speed;
                this.color.a = opacity;
            }
        },
    };
}

 */

function fadeOut(speed = 1){
    let opacity = 1;
    return{
        add(){
            this.color.a = opacity;
        },
        update(){
            if(opacity > 0){
                opacity -= dt() * speed;
                this.color.a = opacity;
            }
        }
    }
}

scene("game", () => {

    let player = add([
        //pos(width() / 2, height() / 2),
        pos(grid_size*wall_size/2, grid_size*wall_size/2),
        circle(player_size/*, player_size*/),
        color(3, 165, 252),
        origin("center"),
        area(),
        outline(outline_thickness),
    ])

    /*let slashLeft = add([
        pos(player.pos.x - 5, player.pos.y - 5),
        rect(80, 30),
        origin("botright"),
        color(255, 255, 0),
        opacity(1)
    ])*/

    /*slashLeft.onUpdate(() =>{
        slashLeft.pos = player.pos
        if(slashLeft.opacity > 0){
            //console.log("Hiii")
            slashLeft.opacity -= 0.035
        }
        else{

            destroy(slashLeft)
        }

    })*/

    player.onUpdate(() => {
        camPos(player.pos)

    })

    addLevel(
        initialize_walls(),
        {
            width: wall_size,
            height: wall_size,
            "=": () => [
                rect(wall_size, wall_size),
                color(255, 0, 0),
                outline(3),
                origin("topleft"),
                area(),
                solid()
            ],
        }
    )

    loop(2, () => {
        let sign;
        let orig1;
        let orig2;

        if (direction !== "LEFT") {
            sign = 1;
            orig1 = "botright";
            orig2 = "topleft";
        } else {
            sign = -1;
            orig1 = "botleft"
            orig2 = "topright"
        }

        let slash = add([
            pos(player.pos.x + 5 * sign, player.pos.y + 5 * sign),
            rect(100, 50),
            origin(orig1),
            color(255, 255, 0),
            opacity(1)
        ])
        slash.onUpdate(() => {
            slash.pos = player.pos
            if (slash.opacity > 0) {
                //console.log("Hiii")
                slash.opacity -= 0.035
            }
            else {
                destroy(slash)

                let slashRight = add([
                    pos(player.pos.x - 5 * sign, player.pos.y - 5 * sign),
                    rect(100, 50),
                    origin(orig2),
                    color(255, 255, 0),
                    opacity(1)
                ])
                slashRight.onUpdate(() => {
                    slashRight.pos = player.pos
                    if (slashRight.opacity > 0) {
                        //console.log("Hiii")
                        slashRight.opacity -= 0.035
                    } else {
                        destroy(slashRight)
                    }
                })
            }
        })
    })

    onUpdate(() => {

    })

    onLoad(() => {

    })

    /*onKeyPress("space", () => {
        fadeOut(1);
    })*/

    onKeyDown("w", () => {
        // Drze se dva dugmica - gore ide sqrt(2)/2 puta distance
        if(player.pos.y > player_size + wall_size + outline_thickness){
            if(isKeyDown("a") || isKeyDown("d")){
                player.moveBy(0, -distance/Math.sqrt(2))
            } else {
                player.moveBy(0, -distance)
            }
        }
    })
    onKeyDown("a", () => {
        direction = "LEFT";
        if(player.pos.x > player_size + wall_size){
            if(isKeyDown("w") || isKeyDown("s")){
                player.moveBy(-distance/Math.sqrt(2), 0)
            } else {
                player.moveBy(-distance, 0)
            }
        }
    })
    onKeyDown("s", () => {
        if(player.pos.y <= wall_size * (grid_size - 1) - outline_thickness - player_size){
            if(isKeyDown("a") || isKeyDown("d")){
                player.moveBy(0, distance/Math.sqrt(2))
            } else {
                player.moveBy(0, distance)
            }
        }
    })
    onKeyDown("d", () => {
        direction = "RIGHT";
        if (player.pos.x < wall_size * (grid_size - 1) - outline_thickness - player_size){
            if(isKeyDown("w") || isKeyDown("s")){
                player.moveBy(distance/Math.sqrt(2), 0)
            } else {
                player.moveBy(distance, 0)
            }
        }
    })
})

go("game")