import { number, object, string } from "yup";
import { Users, Colors, Icons, Categories } from "../models";

export class CategoryController {
  async post(req, res) {
    const { body, userId } = req;
    const { icon_id, color_id } = body;

    try {
      const schema = object({
        icon_id: number().integer().required(),
        color_id: number().integer().required(),
        category: string().required(),
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

      const iconFound = await Icons.findOne({ id: icon_id });
      if (!iconFound) {
        return res.status(404).json({ error: "Icon not found" });
      }

      const colorFound = await Colors.findOne({ id: color_id });
      if (!colorFound) {
        return res.status(404).json({ error: "Color not found" });
      }

      const categoryCreated = await Categories.create({
        user_id: userId,
        ...body,
      });

      const response = {
        id: categoryCreated.dataValues.id,
        iconUrl: "http://localhost:3333/" + iconFound.dataValues.icon_url,
        hexColor: colorFound.dataValues.hexColor,
        category: categoryCreated.dataValues.category,
      };

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}
