// import jwt from "jsonwebtoken";

// export const protectRoute = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; // Bearer token

//     if (!token) {
//       return res.status(401).json({ message: "No token, unauthorized" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // store user id
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token", error });
//   }
// };


import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // user → { id: ... }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};
