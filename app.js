const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const brandRoutes = require('./routes/brandRoutes');


dotenv.config()


const app = express()
const port = process.env.PORT || 8008 
const dbURL = process.env.DATABASE_URL;


// MongoDB Connection
mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.set('strictQuery', false)
 
let db = mongoose.connection
db.once('open', () => console.log('Connected to MongoDB!'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/cart', cartRoutes)
app.use('/brands', brandRoutes)


app.listen(port, () => {
	console.log(`API is now running on localhost: ${port}`)
})