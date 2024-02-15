

const squares = document.querySelectorAll(".square")
const actions = document.querySelector(".actions")
const turn = document.querySelector(".turn")
const reset = document.querySelector("#reset")
const playerName=document.getElementById("name")
const oppName=document.getElementById("oppname")



const socket = io();

let arr=["","","","","","","","",""]

let name=prompt("enter player  name")

if (name === "") {
    alert("enter name")
}
else {
    socket.emit("login", { name: name })
}

let p2;
let value;
let players;

socket.on("login", (playersArray) => {
    console.log(playersArray)
    players=playersArray[0]
    name === playersArray[0].p1.p1name ? p2 = playersArray[0].p2.p2name : p2 = playersArray[0].p1.p1name
    name === playersArray[0].p1.p1name ? value = playersArray[0].p1.p1value : value = playersArray[0].p2.p2value

    playerName.innerText=name+ ` playing as ${value}`
    oppName.innerText=p2 
    turn.innerHTML=`${playersArray[0].p1.p1name} turns`
        
})


// console.log(players)
squares.forEach((square) => {
    square.addEventListener("click", () => {
        var index = parseInt(square.id)
        if ( arr[index] !== "O") {
            socket.emit("move",{name:name,index:index,square:square})
            
        }
        
        
       
        
    })
})


function result() {
    chekwin()
    if (chekwin().check) {
        let result= chekwin().result
        actions.innerHTML=result
       
        turn.innerHTML = "Game Over"
        gameOver(result)
    }
    console.log(arr)
    if (arr.every((e) => e === 'X' || e === 'O') && !chekwin().check) {
        actions.innerHTML= "Tie"
        gameOver("tie")
        turn.innerHTML="Game Over"
        
    } 
   
}

function gameOver(result) {
    socket.emit("gameOver", { name: name, result: result })
    
    
}



socket.on("move", (data) => {
    console.log(data)
    if (data === null) {
        
    }
    else {
        if (data.count < 9) {
            if (data.count % 2 === 0 && arr[data.index] !== "O" && data.name === players.p1.p1name) {
                arr[data.index] = "X"
                document.getElementById(`${data.index}`).classList.add("cross")
                document.getElementById(`${data.index}`).disabled = true
                turn.innerHTML = `${players.p2.p2name} turn`
                result()
            }
            else if (data.count % 2 !== 0 && arr[data.index] !== "X" && data.name === players.p2.p2name) {
        
                if (arr[data.index] !== "X") {
                    arr[data.index] = "O"
                    document.getElementById(`${data.index}`).classList.add("zero")
                    document.getElementById(`${data.index}`).disabled = true
                    turn.innerHTML = `${players.p1.p1name} turn`
                }
                result()
            }
           
       
            
    
        }
    }
})

reset.addEventListener("click", () => {
    socket.emit("reset", { name: name })
    location.reload()
    
})

socket.on("reset", (data) => {
    
    turn.innerHTML = `${players.p1.p1name} turn`
    actions.innerHTML = "Action"
    // count=0
    
    // arr = ["", "", "", "", "", "", "", "", ""]
    //     alert("please reset the game")
    //     squares.forEach((square) => {
    //         square.classList.remove("cross")
    //         square.classList.remove("zero")
    //     })
   
})

let winarray = [
    
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    
]

function chekwin() {
    for (const win of winarray) {
        let xwin=0
        let owin=0
        for (const index of win) {
            if (arr[index] === "X") {
                xwin++
            }
            else if (arr[index] == "O") {
                owin++
            }
            if (xwin === 3) {
                // console.log("xwins")
                return {
                    check: true,
                    result:"X wins"
                }
            }
            else if (owin === 3) {
                // console.log("owins")
                return {
                    check: true,
                    result: "O wins"
                }
                
            }
        }
    }
    return {
        check:false
    }
}