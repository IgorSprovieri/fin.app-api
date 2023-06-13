import { Users } from "../models";
import bcrypt from "bcrypt";
import { object, string, number, date, InferType } from "yup";

export class UserController {
  async post(req, res) {
    try {
      const schema = object({
        name: string().required(),
        email: string().email().required(),
        password: string().required(),
      });

      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const found = await Users.findOne({ where: { email: req.body.email } });
      if (found) {
        return res.status(400).json({ error: "User already exists" });
      }

      req.body.password = bcrypt.hashSync(req.body.password, 10);

      const result = await Users.create({ ...req.body });
      if (!result) {
        return res.status(400).json({ error: "User not created" });
      }

      result.password = "";
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
