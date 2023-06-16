import { Colors } from "../models";

export class ColorController {
  async getAll(req, res) {
    try {
      const colorsFound = await Colors.findAll();

      return res.status(200).json(colorsFound);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}
