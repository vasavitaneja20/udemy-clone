import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";



// API controller function to manage Clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    // The raw body is already available as req.body due to express.raw() middleware in app.js
    // Svix's verify method can take a Buffer or a string.
    const payload = req.body; 

    // Extract Svix headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Ensure all required headers are present
    if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
      return res.status(400).json({ success: false, error: "Missing Svix headers" });
    }

    // Initialize Svix with your secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
      // Verify the payload using the raw body and headers
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error("❌ Clerk Webhook Verification Failed:", err.message);
      return res.status(400).json({ success: false, error: "Webhook verification failed" });
    }

    const { data, type } = evt;

    console.log("✅ Clerk webhook hit, event type:", type);
    console.log("📦 DB:", mongoose.connection.name);

    if (type === "user.created") {
      const userData = {
        _id: data.id, // Clerk's user ID is a string, use it as _id for MongoDB
        email: data.email_addresses[0].email_address,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(), // Handle potential null/undefined names
        imageUrl: data.image_url,
      };
      await User.create(userData);
      console.log("✅ User inserted:", userData);
    } else if (type === "user.updated") {
        // Handle user updates if necessary
        const userData = {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("✅ User updated:", userData);
    } else if (type === "user.deleted") {
        // Handle user deletion if necessary
        await User.findByIdAndDelete(data.id);
        // Optionally, remove user from enrolledCourses in Course model or set a flag
        console.log("✅ User deleted:", data.id);
    }
    
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Clerk Webhook Processing Error:", err); // Log full error for more details
    res.status(500).json({ success: false, error: "Internal Server Error" }); // Generic 500 for unhandled errors
  }
};

// Initialize Stripe instance
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    // Stripe.webhooks.constructEvent expects the raw body (Buffer)
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Stripe Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
  
        // Getting Session Metadata
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });
  
        const { purchaseId } = session.data[0].metadata;
  
        const purchaseData = await Purchase.findById(purchaseId)
        const userData = await User.findById(purchaseData.userId)
        const courseData = await Course.findById(purchaseData.courseId.toString())
  
        courseData.enrolledStudents.push(userData)
        await courseData.save()
  
        userData.enrolledCourses.push(courseData._id)
        await userData.save()
  
        purchaseData.status = 'completed'
        await purchaseData.save()
  
        break;
      }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Retrieve the checkout session linked to this failed payment intent
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      if (session.data.length === 0) {
        console.warn(`Stripe webhook: No session found for failed payment_intent ${paymentIntentId}.`);
        return res.status(200).json({ received: true });
      }

      const { purchaseId } = session.data[0].metadata;

      if (!purchaseId) {
        console.warn("Stripe webhook: Missing purchaseId in session metadata for failed payment.");
        return res.status(200).json({ received: true });
      }

      try {
        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
          purchaseData.status = 'failed';
          await purchaseData.save();
          console.log(`✅ Purchase ${purchaseId} marked as failed.`);
        } else {
          console.error(`Stripe webhook: Purchase with ID ${purchaseId} not found for failed payment.`);
        }
      } catch (dbError) {
        console.error("❌ Stripe Webhook DB Update Error (Payment Failed):", dbError);
        return res.status(500).json({ received: false, error: "Database update failed" });
      }
      break;
    }

    // Add other event types as needed
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  // Always return a 200 to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
};