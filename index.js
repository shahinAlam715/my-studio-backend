import express from "express"
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())


const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB()

app.get("/", (req, res)=>{
    res.send("Allhamdulilah !!")
})

app.listen(PORT,()=>{
    console.log(`Server is runing at ${PORT}`);
})