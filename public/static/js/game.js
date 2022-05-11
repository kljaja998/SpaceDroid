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
let isGoingLeft = true;

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
        outline(outline_thickness)
    ])

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

        if (isGoingLeft) {
            sign = -1;
            orig1 = "topleft";
            orig2 = "botright";
        } else {
            sign = 1;
            orig1 = "topright"
            orig2 = "botleft"
        }

        let slash = add([
            "slash",
            pos(player.pos.x + 5 * sign, player.pos.y + 5 * sign),
            rect(100, 50),
            origin(orig1),
            color(255, 255, 0),
            opacity(1),
            area()
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
                    opacity(1),
                    area()
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
        isGoingLeft = true;
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
        isGoingLeft = false;
        if (player.pos.x < wall_size * (grid_size - 1) - outline_thickness - player_size){
            if(isKeyDown("w") || isKeyDown("s")){
                player.moveBy(distance/Math.sqrt(2), 0)
            } else {
                player.moveBy(distance, 0)
            }
        }
    })

    //////////////////////// Enemy

    let enemy_speed=50;

    function randPos(){
        return (vec2(rand(wall_size+player_size,(grid_size-1) * wall_size-player_size), rand(wall_size+player_size,(grid_size-1) * wall_size-player_size)));
    }

    function randPosition(pos){
        let enemy_position = randPos();
        while (enemy_position.dist(pos)<player_size*2) enemy_position = randPos();
        return enemy_position;
    }

    loop(2, () => {
        let green=rand(90, 250);
        let enemy_size=player_size+rand(player_size/2,player_size)
        let position=randPosition(vec2(player.pos.x,player.pos.y))

        let enemy = add([
            "enemy",
            health(20),
            pos(position),
            circle(enemy_size),
            color(0, green, 0),
            origin("center"),
            area({shape:"circle",height:enemy_size*2,width:enemy_size*2}),
            outline(outline_thickness),
            //move(player.pos.angle(position),40),
        ])
        onUpdate(()=>{
            let vector=vec2(player.pos.x-enemy.pos.x, player.pos.y-enemy.pos.y)
            enemy.moveBy(vec2(vector.x/vector.len(), vector.y/vector.len()).scale(dt()*enemy_speed))
        })
        enemy.on("death",()=>{
            destroy(enemy)
        })

        enemy.onCollide("slash", () =>{
            enemy.hurt(10)
        })

        enemy.onCollide("shield", ()=>{
            enemy.hurt(5)
        })
    })

    //// Shield u pokusaju

    let shield_speed=150;

    function makeShield(position){
        let shield = add([
            "shield",
            pos(position),
            circle(player_size*0.75),
            color(255,255,0),
            area({shape:"circle",width:player_size*1.5,height:player_size*1.5}),
            origin("center"),
            outline(outline_thickness),
           // follow(player, vec2(1,1))
        ])
        onKeyDown("w", () => {
            // Drze se dva dugmica - gore ide sqrt(2)/2 puta distance
            if(player.pos.y > player_size + wall_size + outline_thickness){
                if(isKeyDown("a") || isKeyDown("d")){
                    shield.moveBy(0, -distance/Math.sqrt(2))
                } else {
                    shield.moveBy(0, -distance)
                }
            }
        })
        onKeyDown("a", () => {
            isGoingLeft = true;
            if(player.pos.x > player_size + wall_size){
                if(isKeyDown("w") || isKeyDown("s")){
                    shield.moveBy(-distance/Math.sqrt(2), 0)
                } else {
                    shield.moveBy(-distance, 0)
                }
            }
        })
        onKeyDown("s", () => {
            if(player.pos.y <= wall_size * (grid_size - 1) - outline_thickness - player_size){
                if(isKeyDown("a") || isKeyDown("d")){
                    shield.moveBy(0, distance/Math.sqrt(2))
                } else {
                    shield.moveBy(0, distance)
                }
            }
        })
        onKeyDown("d", () => {
            isGoingLeft = false;
            if (player.pos.x < wall_size * (grid_size - 1) - outline_thickness - player_size){
                if(isKeyDown("w") || isKeyDown("s")){
                    shield.moveBy(distance/Math.sqrt(2), 0)
                } else {
                    shield.moveBy(distance, 0)
                }
            }
        })
        shield.onUpdate(()=>{
           let vector=vec2(player.pos.x-shield.pos.x, player.pos.y-shield.pos.y)
           if (vector.len()>3*player_size) shield.moveBy(vec2(vector.x/vector.len(), vector.y/vector.len()).scale(dt()*enemy_speed))
            shield.moveBy(vec2(vector.x/vector.len(), vector.y/vector.len()).normal().scale(shield_speed).scale(dt()))
        })
    }
    makeShield(vec2(player.pos.x+2*player_size, player.pos.y+2*player_size))
    makeShield(vec2(player.pos.x-2*player_size, player.pos.y-2*player_size))

})

go("game")