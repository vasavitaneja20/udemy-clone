import express, { application } from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import dotenv from 'dotenv';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoute.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ MUST come before any route needing req.body

await connectDB();
await connectCloudinary();

app.use(clerkMiddleware());
app.use(requireAuth());

// Your routes
app.get('/', (req, res) => res.send('API working'));
app.post('/clerk', clerkWebhooks); // already uses express.json()

// Mount routes AFTER express.json()
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));