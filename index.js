import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import cors from "cors";
import { createRemoteJWKSet, jwtVerify } from "jose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_DB_URL);
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
const bookingCollection = db.collection("bookingData");


const VeryfyToken = async(req, res, next)=>{
  const authHeader = req.headers.authorization

  if (!authHeader) {
      return res.status(401).send({msg: "Unauthorized !"})
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
      return res.status(401).send({msg: "Unauthorized !"})
  }

  const JWKS = createRemoteJWKSet(new URL(`http://localhost:3000/api/auth/jwks`))

  try {
    const {payload} = await jwtVerify(token, JWKS)
    next()
  } catch (error) {
     return res.status(500).send({msg: "payload is not veryfy !"})
  }
}

app.get("/", (req, res) => {
  res.send("Allhamdulilah !!");
});

app.post("/studiodata", VeryfyToken, async (req, res) => {
  const data = req.body;
  const result = await studioCollection.insertOne(data);
  res.send(result);
});
app.get("/studiodata", async (req, res) => {
  const data = req.body;
  const result = await studioCollection.find(data).toArray();
  res.send(result);
});



app.get("/studiodata", async (req, res) => {
  try {
    const result = await studioCollection
      .find()
      .sort({ createdAt: -1 }) // Newest studios first
      .limit(6)                // Only 6 studios
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to fetch studios",
    });
  }
});



app.get("/studiodata/:id", VeryfyToken, async (req, res) => {
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
app.delete("/studiodata/:id", VeryfyToken, async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Received ID:", id);

    
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid Studio ID",
      });
    }

   
    const result = await studioCollection.deleteOne({
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

app.patch("/studiodata/:id", VeryfyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    console.log("Received ID:", id);

   
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid Studio ID",
      });
    }

    
    const filter = {
      $or: [
        { _id: new ObjectId(id) },
        { _id: id },
      ],
    };

    
    const existingStudio = await studioCollection.findOne(filter);

    console.log("Existing Studio:", existingStudio);

    if (!existingStudio) {
      return res.status(404).send({
        message: "Studio not found",
      });
    }

   
    const result = await studioCollection.updateOne(
      filter,
      { $set: data }
    );

    res.status(200).send({
      success: true,
      message: "Studio updated successfully",
      result,
    });

  } catch (error) {
    console.error("PATCH Error:", error);

    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.get("/bookings", async(req, res)=>{
   const data = req.body;
  const result = await bookingCollection.find(data).toArray();
  res.send(result);
})
app.get("/bookings/:email", async(req, res)=>{
   const email = req.params.email;
  const result = await bookingCollection.find({email: email}).toArray();
  res.send(result);
})

app.post("/bookings", VeryfyToken, async (req, res) => {
  try {
    const bookingData = req.body;
    const { email, studioId } = bookingData;

    // Required fields check
    if (!email || !studioId) {
      return res.status(400).send({
        success: false,
        message: "User email and Studio ID are required",
      });
    }

    // Check whether this user already booked this studio
    const existingBooking = await bookingCollection.findOne({
        email: email,
      studioId: studioId,
    });

    if (existingBooking) {
      return res.status(409).send({
        success: false,
        message: "You have already booked this studio!",
      });
    }

    // Insert new booking
    const result = await bookingCollection.insertOne(bookingData);

    return res.status(201).send({
      success: true,
      message: "Booking successful",
      result,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).send({
      success: false,
      message: "Booking failed",
    });
  }
});


app.delete("/bookings/:id", async(req, res)=>{
  const {id} = req.params
  const result = await bookingCollection.deleteOne({_id: new ObjectId(id)})
  res.send(result)
})

app.listen(PORT, () => {
  console.log(`Server is runing at ${PORT}`);
});

export default app