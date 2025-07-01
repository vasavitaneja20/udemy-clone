import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import dotenv from 'dotenv';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'; // Ensure correct path
import educatorRouter from './routes/educatorRoute.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';
import bodyParser from 'body-parser';
// body-parser is generally integrated into express nowadays,
// so you might not need to import it explicitly unless you're using an older Express version.
// If you are, keep it, but express.raw() is the key.

console.log("🟢 server.js loaded");

dotenv.config();

const app = express();

app.use(cors());

// IMPORTANT: Define webhook routes *before* `express.json()` or any other body parsing middleware.
// This ensures that the raw request body is available for signature verification.

// Clerk Webhook Route
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

// Stripe Webhook Route
app.post('/stripe', bodyParser.raw({ type: 'application/json' }), stripeWebhooks);

// Now, for all other routes, you can use express.json() to parse JSON bodies
app.use(express.json()); 

// Connect to database and cloudinary
await connectDB();
await connectCloudinary();

// Apply Clerk middleware for protected routes
// Ensure your webhook routes are *not* protected by this if they are public
// (which webhooks generally should be, as they come from external services)
app.use(clerkMiddleware());
app.use(requireAuth()); // Applies to routes defined *after* this middleware

// Your regular API routes
app.get('/', (req, res) => res.send('API working'));

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));