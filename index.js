import express from 'express';
import { config } from './src/config/env.js';
import authRoutes from './src/routes/authRoutes.js'
import bookingRoutes from './src/routes/bookingRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();
const PORT = config.PORT;

app.use(express.json());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
``
// Simple route to check server status
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
