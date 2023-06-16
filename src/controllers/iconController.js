import { Icons } from "../models";

export class IconController {
  async getAll(req, res) {
    try {
      const iconsFound = await Icons.findAll();

      return res.status(200).json(iconsFound);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}
