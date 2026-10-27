
const { MongoClient } = require("mongodb");

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;

  return client;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("dataScienceDigitalLibrary");

    await db.command({ ping: 1 });

    return res.status(200).json({
      success: true,
      message: "MongoDB connected successfully"
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Database connection failed"
    });
  }
};
