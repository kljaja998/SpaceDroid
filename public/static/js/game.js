
kaboom({
    global: true,
    //fullscreen: true,
    scale: 1,
    debug: true,
    background: [0, 0, 0, 1],
    width: 800,
    height: 800,
})

// *************
// LOAD ASSETS
// *************

loadSound("hit", "/sounds/hitHurt.wav")
loadSound("boom", "/sounds/explosion.wav")
loadSound("slash", "/sounds/slash.wav")
loadSound("music", "/sounds/music.mp3")

// *************
// GAME SETUP
// *************

let grid_size = 30;
let distance = 5;
let player_size = 15;
let wall_size = 40;
let max_lives = 5
let outline_thickness = 3;
let isGoingLeft = true;
let soundOn = true;
let soundVolume = 0.5
let musicVolume = 0.8

function initialize_walls(){
    let walls = [];
    walls.push("=".repeat(grid_size))
    for(let i = 0; i < grid_size - 2; i++){
        walls.push("=" + " ".repeat(grid_size - 2) + "=")
    }
    walls.push("=".repeat(grid_size))
    return walls
}

function addButton(btn_txt, btn_pos, btn_tag = "button", btn_fun){
    const btn = add([
        btn_tag,
        text(btn_txt),
        pos(btn_pos),
        area({cursor: "pointer",}),
        scale(1),
        origin("center"),
    ])

    btn.onClick(btn_fun)

    btn.onUpdate(() => {
        if(btn.isHovering()){
            if (btn.isHovering()) {
                const t = time() * 10
                btn.color = rgb(
                    wave(0, 255, t),
                    wave(0, 255, t + 2),
                    wave(0, 255, t + 4),
                )
                btn.scale = vec2(1.2)
            } else {
                btn.scale = vec2(1)
                btn.color = rgb()
            }
        }
        else{
            btn.color = rgb(),
            btn.scale = vec2(1)
        }
    })
}

//------------------------ Main game -----------------------------

scene("main_game", () => {

    layers(['obj', 'ui'], 'obj')

    let points = 0
    let num_of_lives = max_lives

    let txt_points = add([
        text("Enemies defeated: 0", {size: 30}),
        pos(20, 20),
        layer('ui'),
    ])
    
    let txt_lives = add([
        text("Lives left: "+num_of_lives, {size: 30}),
        pos(500, 20),
        layer('ui'),
    ])
    txt_points.onUpdate(() => {
        let x = player.pos.x
        let y = player.pos.y
        txt_points.pos = [x - width() / 2 + 20, y - height() / 2 + 20]
        txt_lives.pos = [x - width() / 2 + 500, y - height() / 2 + 20]
    })

    let player = add([
        //pos(width() / 2, height() / 2),
        "player",
        health(50),
        pos(grid_size*wall_size/2, grid_size*wall_size/2),
        circle(player_size/*, player_size*/),
        color(3, 165, 252),
        origin("center"),
        area({shape:"circle",height:player_size*2,width:player_size*2}),
        outline(outline_thickness)
    ])

    player.onUpdate(() => {
        camPos(player.pos)

    })

    player.on("death",()=>{
        // ----------------------neki zvucni efekat
        go("lose",points)
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
            if(slash.opacity == 1){
                play("slash", {volume: soundVolume})
            }
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
                    if(slashRight.opacity == 1){
                        play("slash", {volume: soundVolume})
                    }
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
        play("music", {volume: musicVolume, loop: true})
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
    //------------------------------- Enemy -----------------------------------------

    let enemy_speed=50;

    function randPos(){
        return (vec2(rand(wall_size+player_size,(grid_size-1) * wall_size-player_size), rand(wall_size+player_size,(grid_size-1) * wall_size-player_size)));
    }

    function randPosition(pos){
        let enemy_position = randPos();
        while (enemy_position.dist(pos)<player_size*5) enemy_position = randPos();
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
            shake(5)
            play("boom", {volume: soundVolume})
            destroy(enemy),
            points++;
            txt_points.text = "Enemies defeated: " + points;
            // Spawn effect
            for(let i = 0; i < rand(3, 7); i++){
                add([
                    pos(enemy.pos),
                    origin("center"),
                    scale(rand(0.25, 1)),
                    rect(20, 15),
                    rotate(rand(0, 180)),
                    lifespan(1, {fade: 0.5}),
                    color(0, rand(90, 250), 0),
                    area(),
                    move(new Vec2(rand(-1, 1), rand(-1, 1)), 30),
                ])
            }
        })

        enemy.onCollide("slash", () =>{
            enemy.hurt(10)
        })

        enemy.onCollide("shield", ()=>{
            enemy.hurt(5)
            play("hit", {volume: soundVolume})
            for(let i = 0; i < rand(2, 5); i++){
                add([
                    pos(enemy.pos),
                    origin("center"),
                    scale(rand(0.25, 1)),
                    rect(10, 10),
                    rotate(rand(0, 180)),
                    lifespan(2, {fade: 1}),
                    area(),
                    move(new Vec2(rand(-1, 1), rand(-1, 1)), 60),
                ])
            }
        })

        enemy.onCollide("player", ()=>{
            player.hurt(10)
            enemy.hurt(Math.round(100 / max_lives))
            txt_lives.text = "Lives left: " + --num_of_lives;
        })
    })

    //-------------------------- Shield ------------------------------------

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

//------------------------ Main menu -----------------------------

scene ("main_menu", () => {

    /*add([
        text("🎯🎯🎯"),
        pos(width() / 2, height() / 2),
        color(255, 0, 0),
    ])*/

    addButton("Start", vec2(width() / 2, height() / 2 - 50), "button" ,() => {
        go("main_game")
    })
    addButton("Sound: ON", vec2(width() / 2, height() / 2 + 50), "tag_sound", () =>{
        const allButtons = get("tag_sound")
        let button = allButtons[0]
        if(soundOn){
            button.text = "Sound: OFF"
        }
        else{
            button.text = "Sound: ON"
        }
        soundOn = !soundOn       
        if(soundOn){
            musicVolume = 0.8
            soundVolume = 0.5
        } 
        else{
            musicVolume = 0
            soundVolume = 0
        }
    })
})

//------------------------ Game Over ----------------------------

scene("lose", (points) => {

    // display score
    add([
        text("Game Over"),
        pos(width() / 2, height() / 2 - 80),
        scale(1.5),
        origin("center"),
    ]);
    add([
        text("score: " + points),
        pos(width() / 2, height() / 2 + 80),
        origin("center"),
    ]);

    add([
        text("Press the space bar to try again.", {
            size: 25,
        }),
        pos(width() / 2, height() / 2 + 160),
        origin("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("main_game"));
    onClick(() => go("main_game"));

    /*addButton("Main menu", pos(width() / 2, height() / 2 + 90), "button", () => {
        go("main_menu")
    })*/

});

go("main_menu")