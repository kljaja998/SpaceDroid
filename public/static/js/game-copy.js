    kaboom({
        width: 800,
        height: 800,
        debug: true,
        clearColor: [0, 0, 0, 1],
    });

// *************
// GAME SETUP
// *************

    add([
        rect(50, 50),
        pos(0, 0),
        color(255, 255, 255),
    ])

    /*
    let grid_size = 10;
    let distance = 5;
    let player_size = 40;
    let wall_size = 40;
    let outline_thickness = 3;

    function initialize_walls(){
        let walls = [];
        walls.push("=".repeat(grid_size))
        for(let i = 0; i < grid_size - 2; i++){
            walls.push("=" + " ".repeat(grid_size - 2) + "=")
        }
        walls.push("=".repeat(grid_size))
        return walls
    }


    scene('mainGame', () =>{

        console.log(distance)

        let background = add([
            rect(width(), height()),
            pos(width(), height()),
            color(0, 255, 100),
            origin("topleft"),
            pos(0, 0),
        ])

    })



    addLevel(
        initialize_walls(),
        {
            width: wall_size,
            height: wall_size,
            "=": () => [
                rect(wall_size, wall_size),
                color(255, 0, 0),
                outline(1),
                pos(width() / 4, height() / 4),
                origin("topleft"),
                area(),
                solid()
            ],
        }
    )


    let player = add([
        pos(width() / 2, height() / 2),
        circle(player_size, player_size),
        color(3, 165, 252),
        origin("center"),
        area(),
        outline(outline_thickness),
    ])

    let slashLeft = [
        //pos(player.pos.x - 50,
    ]

    let slashRight = [
    ]

    onUpdate(() => {

    })

    onLoad(() => {
    })

    onKeyDown("w", () => {
        if(player.pos.y > player_size + wall_size + outline_thickness)
            player.moveBy(0, -distance)
    })
    onKeyDown("a", () => {
        if(player.pos.x > player_size + wall_size)
            player.moveBy(-distance, 0)
    })
    onKeyDown("s", () => {
        if(player.pos.y <= height() - player_size - wall_size - outline_thickness)
            player.moveBy(0, distance)
    })
    onKeyDown("d", () => {
        if(player.pos.x < width() - player_size - wall_size - outline_thickness)
            player.moveBy(distance, 0)
    })

    start('mainGame');

     */