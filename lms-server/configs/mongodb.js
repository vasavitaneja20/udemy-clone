import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();





//connect to mongo db database
const connectDB = async() => {

 mongoose.connection.on('connected', ()=>console.log('Database Connected'))
 await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
 //uri helps create an instance of mongodb client
}

export default connectDB

