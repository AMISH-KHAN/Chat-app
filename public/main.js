const socket = io();


const squares = document.querySelectorAll(".square")
const actions = document.querySelector(".actions")
const turn = document.querySelector(".turn")
const reset = document.querySelector("#reset")
let count = 0;
let arr=["","","","","","","","",""]

const p1=prompt("enter player 1 name")
const p2=prompt("enter player 2 name")


turn.innerHTML=`${p1} turns`
squares.forEach((square) => {
    square.addEventListener("click", () => {
        var index = parseInt(square.id)
        if (count <= 8 && arr[index]!=="O") {
            if (count % 2 == 0) {
                
                
                turn.innerHTML=`${p2} turn`
                console.log("xturns")
                square.classList.add("cross")
                arr[index] = "X"
                    count++
            
            }
            else {
                turn.innerHTML=`${p1} turn`
                if (arr[index] !== "X") {

                socket.emit("turn",index,count)
                    
                    
                    
                    console.log("yturn")
                    arr[index]="O"
                    square.classList.add("zero")
                    count++
                }
            }
            
        }
        
        
        chekwin()
        if (chekwin().check) {
            actions.innerHTML= chekwin().result
            count = 9
            turn.innerHTML="Game Over"
        }
        console.log(arr)
        if (arr.every((e) => e === 'X' || e === 'O') && !chekwin().check) {
            actions.innerHTML= "Tie"
            turn.innerHTML="Game Over"
            
        } 
        
    })
})

reset.addEventListener("click", () => {
    turn.innerHTML = `${p1} turn`
    actions.innerHTML="Action"
    count=0
    arr = ["", "", "", "", "", "", "", "", ""]
    squares.forEach((square) => {
        square.classList.remove("cross")
        square.classList.remove("zero")
    })
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