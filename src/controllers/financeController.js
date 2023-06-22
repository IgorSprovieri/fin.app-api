import { Users, Categories, Finances } from "../models";
import { date, number, object, string } from "yup";

export class FinanceController {
  async post(req, res) {
    const { body, userId } = req;
    const { category_id, date, name, value } = body;

    try {
      const schema = object({
        category_id: number().integer().required(),
        date: date().required(),
        name: string().required(),
        value: number().required(),
      });

      await schema.validate(body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findOne({ id: userId });
      if (!userFound) {
        return res.status(404).json({ error: "User not found" });
      }

      const categoryFound = await Categories.findOne({
        user_id: userId,
        id: category_id,
      });
      if (!categoryFound) {
        return res.status(404).json({ error: "Category not found" });
      }

      const financeCreated = await Finances.create({
        user_id: userId,
        ...body,
      });

      return res.status(201).json(financeCreated);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}
