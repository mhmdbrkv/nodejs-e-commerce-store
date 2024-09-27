import mongoose from "mongoose";

export default () => {
  try {
    mongoose.connect(process.env.DB_CONNECT).then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    });
  } catch (error) {
    console.log("Error connecting to MONGODB", error.message);
    process.exit(1);
  }
};
