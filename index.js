import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
const dbClient = await connectToMongoDB();
const db = dbClient.db("studio-server");
const studioCollection = db.collection("studioData");

app.get("/", (req, res) => {
  res.send("Allhamdulilah !!");
});

app.post("/studiodata", async (req, res) => {
  const data = req.body;
  const result = await studioCollection.insertOne(data);
  res.send(result);
});
app.get("/studiodata", async (req, res) => {
  const data = req.body;
  const result = await studioCollection.find(data).toArray();
  res.send(result);
});

app.get("/studiodata/:id", async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Received ID:", id);

    // Check whether the ID is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid Studio ID",
      });
    }

    // Search both ObjectId and String formats
    const result = await studioCollection.findOne({
      $or: [
        { _id: new ObjectId(id) },
        { _id: id },
      ],
    });

    console.log("Studio Result:", result);

    if (!result) {
      return res.status(404).send({
        message: "Studio not found",
      });
    }

    res.status(200).send(result);

  } catch (error) {
    console.error("Dynamic API Error:", error);

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is runing at ${PORT}`);
});

export default app