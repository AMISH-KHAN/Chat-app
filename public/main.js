

const squares = document.querySelectorAll(".square")
const actions = document.querySelector(".actions")
const turn = document.querySelector(".turn")
const reset = document.querySelector("#reset")
const playerName=document.getElementById("pname")
const oppName=document.getElementById("oppname")
const playingAs=document.getElementById("playing-as")
const main_container = document.querySelector(".main-container")
const form = document.querySelector(".form")
const loading = document.querySelector(".loading")
const details=document.querySelector(".details")

main_container.style.display="none"
details.style.display="none"
loading.style.display = "none"



let pname

//getting the name of the player

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let newname = e.target.name.value
    if (newname !== "") {
        pname = newname
        // emitting the login with the name of the current player
        socket.emit("login", { name: newname })
        
        loading.style.display="flex"
    }
    
})

const socket = io();

let arr=["","","","","","","","",""]



let p2;
let value;
let players;


// when two players logedin this code will run

socket.on("login", (playersArray) => {
    // console.log(playersArray)
    form.style.display="none"
    // console.log(pname)
    main_container.style.display = "grid"
    details.style.display="block"
    players = playersArray[0]
    


    pname === playersArray[0].p1.p1name ? p2 = playersArray[0].p2.p2name : p2 = playersArray[0].p1.p1name
    pname === playersArray[0].p1.p1name ? value = playersArray[0].p1.p1value : value = playersArray[0].p2.p2value

    playerName.innerHTML = pname 
    // console.log(playerName.innerText)
    playingAs.innerText=value
    oppName.innerText=p2 
    turn.innerHTML=`${playersArray[0].p1.p1name} turns`
        
})

function gameOver(result) {
    socket.emit("gameOver", { name: name, result: result })
    
    
}



socket.on("move", (data) => {
    // console.log(data)
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
    
   
})
// console.log(players)

squares.forEach((square) => {
    square.addEventListener("click", () => {
        var index = parseInt(square.id)
        if ( arr[index] !== "O") {
            socket.emit("move",{name:pname,index:index,square:square})
            
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
    // console.log(arr)
    if (arr.every((e) => e === 'X' || e === 'O') && !chekwin().check) {
        actions.innerHTML= "Tie"
        gameOver("tie")
        turn.innerHTML="Game Over"
        
    } 
   
}



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