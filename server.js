const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const summaryRoutes = require("./routes/summaryRoutes");
 // your user login/signup routes
const qaRoutes = require('./routes/qaRoutes');




const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/legal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use("/api/summaries", summaryRoutes);
app.use('/api/qa', qaRoutes);// Mount the /signup and /login routes

app.listen(5000, () => console.log('Server running on port 5000'));
