import { Users } from "../models";
import bcrypt from "bcrypt";
import { object, string, number, date, InferType } from "yup";
import jwt from "jsonwebtoken";
import awsS3 from "../libs/awsS3";

export class UserController {
  async post(req, res) {
    const { body } = req;
    const { email, password } = body;

    try {
      const schema = object({
        name: string().required(),
        email: string().email().required(),
        password: string().required(),
      });

      await schema.validate(body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findOne({ where: { email: email } });
      if (userFound) {
        return res.status(400).json({ error: "User Already Exists" });
      }

      body.password = bcrypt.hashSync(password, 10);

      const createdUser = await Users.create({ ...body });
      if (!createdUser) {
        return res.status(400).json({ error: "User Not Created" });
      }

      const payload = { id: createdUser.id };
      const secret = process.env.JWT_SECRET || "fin.app";
      const options = { expiresIn: "7d" };

      createdUser.dataValues.token = jwt.sign(payload, secret, options);
      createdUser.dataValues.password = "";

      return res.status(201).json(createdUser.dataValues);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async avatar(req, res) {
    const { body, userId } = req;
    const { mime, base64 } = body;

    try {
      const schema = object({
        mime: string().required(),
        base64: string().required(),
      });

      await schema.validate(body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findByPk(userId);
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
      const uploadResult = await awsS3.upload(key, base64, mime);
      if (uploadResult?.error) {
        return res.status(400).json({ error: "Image Not Uploaded" });
      }

      userFound.avatar_url = uploadResult.Location;

      const updatedUser = await userFound.save();
      if (!updatedUser) {
        res.status(400).json({ error: "User Not Updated" });
      }

      updatedUser.password = "";

      return res.status(200).json(updatedUser.dataValues);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async login(req, res) {
    const { body } = req;
    const { email, password } = body;

    try {
      const schema = object({
        email: string().email().required(),
        password: string().required(),
      });

      await schema.validate(body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findOne({ where: { email: email } });
      if (!userFound) {
        return res.status(401).json({ error: "User or Password is Invalid" });
      }

      const match = await bcrypt.compare(password, userFound.password);
      if (!match) {
        return res.status(401).json({ error: "User or Password is Invalid" });
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

  async get(req, res) {
    const { userId } = req;

    try {
      const userFound = await Users.findOne({ where: { id: userId } });
      if (!userFound) {
        return res.status(404).json({ error: "User Not Found" });
      }

      return res.status(200).json(userFound.dataValues);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async put(req, res) {
    const { userId } = req;
    const { body } = req;
    const { name, email, password } = body;

    try {
      const schema = object({
        name: string(),
        email: string().email(),
        password: string(),
      });

      await schema.validate(body);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }

    try {
      const userFound = await Users.findOne({ where: { id: userId } });
      if (!userFound) {
        return res.status(404).json({ error: "User Not Found" });
      }

      for (const key in body) {
        if (body[key] !== "") {
          userFound[key] = body[key];
        }
      }

      if (email) {
        const foundNewEmail = await Users.findOne({ where: { email: email } });
        if (foundNewEmail) {
          return res.status(403).json({ error: "Email Already Exists" });
        }
      }

      const updatedUser = await userFound.save();
      if (!updatedUser) {
        res.status(400).json({ error: "User Not Updated" });
      }

      updatedUser.password = "";

      return res.status(200).json(updatedUser.dataValues);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
