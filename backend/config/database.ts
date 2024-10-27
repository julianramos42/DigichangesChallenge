import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const mongoUrl = process.env.MONGO_DATABASE_URL;

if (!mongoUrl) {
    throw new Error("MONGO_DATABASE_URL no esta definida");
}

mongoose.connect(mongoUrl)
    .then(() => console.log('BDD Conectada'))
    .catch(err => console.log(err));