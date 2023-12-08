const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const https = require('https');// for https

// Middleware to parse JSON requests+
app.use(express.json());

// Allow requests from multiple origins
const allowedOrigins = ['http://192.168.130.176:4200', 'http://localhost:4200'];  //change here for https or https
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is allowed or if it is a request from the same origin
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions)); //change here for ssl or without ssl

// Connecting to MongoDB database
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Connect to MongoDB (replace <YOUR_MONGODB_URI> with your actual URI)
// mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://192.168.130.34:27019/osint3', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Mongoose schema and model for your data (e.g., News)
const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  link: String,
  publishedAt: String,
  language: String,
  image_url: String,
  source_id: String,
  pubDate: String,
  country: String,
  searchQuery: String// Add search keyword field
});

// Define a Mongoose schema and model for your data (e.g., Youtube)
const youtubeSchema = new mongoose.Schema({
  videoID: String,
  title: String,
  channelName: String,      // Add channel name field
  publishedDate: String,   // Add published date field
  description: String,      // Add description field
  searchQuery: String,       // Add search query field
  fullDescription: String,
  tags: Object
});

//elibrary schema
const elibrarySchema = new mongoose.Schema({
  meta_CreationDate: String,
  filename: String,
  meta_Producer: String,
  source: String,
  meta_Creator: String,
  source_short: String,
  Converted_filename: String,
  source_link: String,
  cover: String,
  published_Date: String,
  site_Title: String,
  // Add other properties as needed
});

// user data schema
const userSchema = new mongoose.Schema({
  id: String,
  fullName: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'user'] }
});

const News = mongoose.model('News', newsSchema);
const Youtube = mongoose.model('Youtube', youtubeSchema);
const Elibrary = mongoose.model('Elibrary', elibrarySchema, 'elibrary');
const User = mongoose.model('User', userSchema);

// Define a route to handle POST requests

// News Route
app.post('/api/news', async (req, res) => {
  // console.log("succesful");
  try {
    // Create a new document based on the incoming request data
    const news = new News(req.body);
    // Save the document to the database
    await news.save();
    res.status(200).send('Data saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

//Youtube Route
app.post('/api/youtube', async (req, res) => {
  // console.log("succesful");
  try {
    // Create a new document based on the incoming request data
    const youtube = new Youtube(req.body);
    // Save the document to the database
    await youtube.save();
    res.status(200).send('Data saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

// Define a route to handle GET requests
app.get('/api/news', async (req, res) => {
  const searchTerm = req.query.q; // Extract the search query from the request query parameters
  const language = req.query.language; // Extract the language from the request query parameters
  try {
    let pipeline = [];
    if (searchTerm && language) {
      pipeline.push(
        {
          $match: {
            $and: [
              { title: { $regex: searchTerm, $options: 'i' } },
              { language: language }
            ]
          }
        }
      );
    } else if (searchTerm) {
      pipeline.push(
        { $match: { title: { $regex: searchTerm, $options: 'i' } } }
      );
    } else if (language) {
      pipeline.push(
        { $match: { language: language } }
      );
    }
    pipeline.push(
      { $group: { _id: "$title", doc: { $first: "$$ROOT" } } },
      { $replaceWith: "$doc" }
    );
    const newsData = await News.aggregate(pipeline);
    res.json(newsData); // Send the data as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from MongoDB');
  }
});

//fetch elibrary data
app.get('/api/elibrary', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const folderName = req.query.folderName; // Extract the folderName from the request query parameters
    const limit = parseInt(req.query.limit) || 50; // Default to 50 if 'limit' is not provided
    let query = {};
    if (searchTerm) {
      query.filename = { $regex: searchTerm, $options: 'i' };
    }
    if (folderName) {
      query.source_short = folderName; // Filter by folderName if provided
    }
    const elibraryData = await Elibrary.find(query).limit(limit);
    res.json(elibraryData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching elibrary data from MongoDB');
  }
});

//pdf search
app.get('/api/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'path/to/pdf', filename);
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a response
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// API endpoint to register a new user
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, role } = req.body; 
    console.log('Received role:', role);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed.' });
  }
});


// API endpoint to handle user login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// API Endpoint to fetch news from MongoDB based on keywords
app.get('/api/news/:keywords', (req, res) => {
  const keywords = req.params.keywords.split(',');
  News.find(
    {
      $or: [
        { title: { $regex: keywords.join('|'), $options: 'i' } },
      ]
    },
    (error, result) => {
      if (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).send(error);
      } else {
        console.log('Data fetched from MongoDB:', result);
        res.status(200).send(result);
      }
    }
  );
});

// console.log('__dirname:', __dirname);
// // Specify the path to your SSL/TLS certificates
// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, '/assets/server.key')),
//   cert: fs.readFileSync(path.join(__dirname, '/assets/server.crt')),
// };
// // Create an HTTPS server
// const server = https.createServer(sslOptions, app);
// Start the server
// server.listen(port, () => {
//   console.log(`Server running on https://localhost:${port}`);
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})