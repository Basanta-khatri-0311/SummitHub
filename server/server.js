const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config({ override: true });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5500;

// Middlewares
app.use(cors());
app.use(express.json());

const postRoutes = require('./routes/postRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/partners', partnerRoutes);

app.get('/', (req, res) => {
  res.send('SummitHub API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
