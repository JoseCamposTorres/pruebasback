import nodemailer from "nodemailer";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

export default transporter;
