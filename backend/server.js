import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/userRoute";
import config from "./config";

const mongodbURL = config.MONGODB_URL;

mongoose
  .connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error.reason);
  });

const app = express();

app.use(express.json());
app.use("/api/users", userRouter);

app.listen(5000, () => {
  console.log("Listening in the Port 5000...");
});
