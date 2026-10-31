import express from "express"


const app = express()
const PORT = 5000

app.get("/", (req, res)=>{
    res.send("Allhamdulilah !!")
})

app.listen(PORT,()=>{
    console.log(`Server is runing at ${PORT}`);
})