const express = require('express');
const  cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        await sequelize.sync();
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();