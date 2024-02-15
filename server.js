
const express = require("express")
const { createServer } = require("http")
const { join } = require("path")
const { Server } = require("socket.io")



const app = express()

const server = createServer(app)

const io = new Server(server)

app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname,"./public/index.html"))
})

let players=[]
let playersArray=[]

io.on("connection", (socket) => {
    socket.on("login", (data) => {
        // io.emit("login",name)
        if (data.name !== null) {
            players.push(data.name)
        }
        if (players.length === 2) {
            let obj1 = {
                p1name: players[0],
                p1value: "X",
                p1move:""
            }
            let obj2 = {
                p2name: players[1],
                p2value: "O",
                p2move:""
            }

            let obj = {
                p1: obj1,
                p2:obj2
            }
            playersArray.push(obj)

            io.emit("login",playersArray)

        }
    })
})


server.listen(3000, () => {
    console.log("Server runing at http://localhost:3000")
})