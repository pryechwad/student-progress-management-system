import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost/spms';
mongoose.connect(uri);
mongoose.connection.on('open', () => console.log('MongoDB connected'));
