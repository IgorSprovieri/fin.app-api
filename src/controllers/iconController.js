import { Icons } from "../models";

export class IconController {
  async getAll(req, res) {
    try {
      const iconsFound = await Icons.findAll();

      iconsFound.forEach((element) => {
        element.dataValues.icon_url =
          "http://localhost:3333/" + element.dataValues.icon_url;
      });

      return res.status(200).json(iconsFound);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}
