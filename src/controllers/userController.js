import { Users } from "../models";
import bcrypt from "bcrypt";
import { object, string, number, date, InferType } from "yup";
import jwt from "jsonwebtoken";
import awsS3 from "../libs/awsS3";

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
      const userFound = await Users.findOne({
        where: { email: req.body.email },
      });
      if (userFound) {
        return res.status(400).json({ error: "User already exists" });
      }

      req.body.password = bcrypt.hashSync(req.body.password, 10);

      const result = await Users.create({ ...req.body });
      if (!result) {
        return res.status(400).json({ error: "User not created" });
      }

      const payload = { id: result.id };
      const secret = process.env.JWT_SECRET || "fin.app";
      const options = { expiresIn: "7d" };

      result.dataValues.token = jwt.sign(payload, secret, options);
      result.dataValues.password = "";

      return res.status(201).json(result.dataValues);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async avatar(req, res) {
    try {
      const schema = object({
        base64: string().required(),
        mime: string().required(),
      });

      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findByPk(req.userId);
      if (!userFound) {
        return res.status(404).json({ error: "User Not Found" });
      }

      if (userFound.avatar_url) {
        const splitted = userFound.avatar_url.split("/");
        const oldKey = splitted[splitted.length - 1];
        const deleteResult = await UploadImage.delete(oldKey);

        if (deleteResult.error) {
          throw new Error(deleteResult);
        }
      }

      const key = `user_${userFound.id}_${new Date().getTime()}`;
      const uploadResult = await awsS3.upload(
        key,
        req.body.base64,
        req.body.mime
      );
      if (uploadResult?.error) {
        return res.status(400).json({ error: "Image not uploaded" });
      }

      userFound.avatar_url = uploadResult?.Location;

      const result = await userFound.save();
      if (!result) {
        res.status(400).json({ error: "User not updated" });
      }

      result.password = "";

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async login(req, res) {
    try {
      const schema = object({
        email: string().email().required(),
        password: string().required(),
      });

      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findOne({
        where: { email: req.body.email },
      });
      if (!userFound) {
        return res.status(401).json({ error: "User or password is invalid" });
      }

      const match = await bcrypt.compare(req.body.password, userFound.password);
      if (!match) {
        return res.status(401).json({ error: "User or password is invalid" });
      }

      const payload = { id: userFound.id };
      const secret = process.env.JWT_SECRET || "fin.app";
      const options = { expiresIn: "7d" };

      userFound.dataValues.token = jwt.sign(payload, secret, options);
      userFound.dataValues.password = "";

      return res.status(200).json(userFound.dataValues);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
