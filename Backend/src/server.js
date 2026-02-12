import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoute from "./route.js";
import mongoose from "mongoose";

const app = express();

dotenv.config();

app.use(cors({ origin: "https://movie-app-nine.vercel.app", credentials: true }));
app.use(express.json());
app.use("/api/movies", movieRoute);

const PORT = process.env.PORT || 3001;

const MongoConnect = async () => {
	await mongoose
		.connect(process.env.MONGODB_CONNECTION_STRING)
		.then(() => console.log("connected to database"))
		.catch((error) => console.error(error));
};

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	MongoConnect();
});
