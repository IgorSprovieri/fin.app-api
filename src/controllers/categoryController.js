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

      return res.status(201).json(categoryCreated);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async getAll(req, res) {
    const { userId } = req;

    try {
      const categoriesFound = await Categories.findAll({
        where: {
          user_id: userId,
        },
        include: [
          { model: Colors, as: "color" },
          { model: Icons, as: "icon" },
        ],
      });

      return res.status(200).json(categoriesFound);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async put(req, res) {
    const { body, params, userId } = req;
    const { id } = params;
    const { icon_id, color_id } = body;

    try {
      const schema = object({
        icon_id: number().integer(),
        color_id: number().integer(),
        category: string(),
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

      const categoryFound = await Categories.findOne({ id: id });
      if (!categoryFound) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (icon_id) {
        const iconFound = await Icons.findOne({ id: icon_id });
        if (!iconFound) {
          return res.status(404).json({ error: "Icon not found" });
        }
      }

      if (color_id) {
        const colorFound = await Colors.findOne({ id: color_id });
        if (!colorFound) {
          return res.status(404).json({ error: "Color not found" });
        }
      }

      const categoryUpdated = await categoryFound.update(
        { ...body },
        {
          where: {
            id: id,
          },
        }
      );

      return res.status(200).json(categoryUpdated);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    const { params, userId } = req;
    const { id } = params;

    try {
      const userFound = await Users.findOne({ id: userId });
      if (!userFound) {
        return res.status(404).json({ error: "User not found" });
      }

      const categoryFound = await Categories.findOne({ id: id });
      if (!categoryFound) {
        return res.status(404).json({ error: "Category not found" });
      }

      const categoryDeleted = await categoryFound.destroy({
        where: {
          id: id,
        },
      });

      return res.status(200).json(categoryDeleted);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}
