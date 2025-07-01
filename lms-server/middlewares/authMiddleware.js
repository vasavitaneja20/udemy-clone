import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // ✅ proper way
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.status(403).json({ success: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};