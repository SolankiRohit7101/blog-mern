import mongoose from "mongoose";
const db = async () => {
  await mongoose
    .connect(process.env.MONGO_DB )
    .then(({ connection }) => console.log(connection.host))
    .catch((err) => console.log(err));
};

export default db;
