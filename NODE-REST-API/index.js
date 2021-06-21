require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDb = require('./config/db')
const routeUser = require('./routes/users')
const routerAuth= require('./routes/auth')
const routePost= require('./routes/post')
const app = express()

const PORT = 8080

connectDb()

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('commom'))

app.use('/api/user',routeUser)
app.use('/api/auth',routerAuth)
app.use('/api/posts',routePost)


app.listen(PORT,()=>console.log('server started'))