import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage.js"; // ✅ added .js
import { insertPreorderSchema } from "./shared/schema.js"; // ✅ added .js
import { z } from "zod";
import crypto from "crypto";
import { MailService } from "@sendgrid/mail";

const mailService = new MailService();

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - email functionality disabled");
}

if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendDiscountCodeEmail(email: string, name: string, code: string): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`Would send email to ${email} with code ${code} (SendGrid not configured)`);
    return;
  }

  try {
    const msg = {
      to: email,
      from: "potatoabc134@gmail.com",
      subject: "Your Exclusive La Mèche Discount Code",
      text: `Dear ${name}, ...`,
      html: `... your styled email template ...` // same as before
    };

    await mailService.send(msg);
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("SendGrid email error:", error);
    throw error;
  }
}

function generateDiscountCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/test-email", async (_req, res) => {
    try {
      await mailService.send({
        to: "battlexboss1234@gmail.com",
        from: "lamechebusiness7@gmail.com",
        subject: "Test Email from La Mèche",
        text: "This is a test email sent from your server using SendGrid.",
      });
      res.json({ message: "Test email sent successfully" });
    } catch (err) {
      console.error("Test email failed:", err);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  app.get("/static", (req, res) => {
    res.sendFile(path.join(__dirname, "../static-site/complete.html"));
  });

  app.post("/api/preorders", async (req, res) => {
    try {
      const validatedData = insertPreorderSchema.parse(req.body);
      const existingPreorder = await storage.getPreorderByEmail(validatedData.email);

      if (existingPreorder) {
        return res.status(400).json({
          message: "This email is already registered for preorder",
          discountCode: existingPreorder.discountCode,
        });
      }

      let discountCode: string;
      let codeExists: boolean;
      do {
        discountCode = generateDiscountCode();
        const existing = await storage.getPreorderByCode(discountCode);
        codeExists = !!existing;
      } while (codeExists);

      const preorder = await storage.createPreorder(validatedData, discountCode);

      try {
        await sendDiscountCodeEmail(preorder.email, preorder.name, preorder.discountCode);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }

      res.status(201).json({
        message: "Preorder created successfully",
        discountCode: preorder.discountCode,
        id: preorder.id
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      console.error("Preorder creation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/preorders/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const preorder = await storage.getPreorderByEmail(email);
      if (!preorder) {
        return res.status(404).json({ message: "Preorder not found" });
      }

      res.json(preorder);
    } catch (error) {
      console.error("Get preorder error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/stats", async (_req, res) => {
    try {
      const stats = await storage.getPreorderStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats retrieval error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/preorders", async (_req, res) => {
    try {
      const preorders = await storage.getAllPreorders();
      res.json(preorders);
    } catch (error) {
      console.error("Get all preorders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return createServer(app);
}
