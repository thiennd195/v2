require('dotenv').config()
const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
                useNewUrlParser:true,
                useUnifiedTopology:true
        })
        console.log('connect db success')
    } catch (error) {
        console.log('connect db fail')

        
    }
}

module.exports = connectDb