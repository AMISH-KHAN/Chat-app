
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


io.on("connection", (socket) => {
    socket.on("turn", (index,count) => {
        io.emit("turn",index,count)
    })
})


server.listen(3000, () => {
    console.log("Server runing at http://localhost:3000")
})