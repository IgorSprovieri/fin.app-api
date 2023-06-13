import jwt from "jsonwebtoken";

export class AuthMiddleware {
  async validateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;

      return next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid Token" });
    }
  }
}
