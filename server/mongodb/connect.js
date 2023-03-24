import mongoose from "mongoose";  // modelling library for creating schema objects and connecting them to database

const connectDB = (url) => {
    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(() => console.log('MongoDB connected successfully'))
        .catch((error) => console.log(error));
}

export default connectDB;