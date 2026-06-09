require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Start the server
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});