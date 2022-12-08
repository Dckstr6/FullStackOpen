require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = "mongodb+srv://dcsktr:Pranay123@cluster0.zcoilrs.mongodb.net/?retryWrites=true&w=majority"

module.exports = {
  MONGODB_URI,
  PORT
}