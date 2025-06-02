import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { insertPreorderSchema } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";
import { MailService } from '@sendgrid/mail';

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
      from: 'noreply@example.com', // Replace with your verified SendGrid sender email
      subject: 'Your Exclusive La Mèche Discount Code',
      text: `Dear ${name},

Thank you for joining the La Mèche community! Your exclusive 10% discount code is: ${code}

IMPORTANT: Please write down this serial code and tell it to us in person when purchasing. If this email doesn't come through, make sure to save this code.

We'll notify you about available dates through posters around town and your local area.

Best regards,
La Mèche Team`,
      html: `
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0B1426 0%, #1A0B2E 50%, #0F172A 100%); color: #E2E8F0; padding: 40px; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2DD4BF; font-size: 32px; margin-bottom: 10px;">La Mèche</h1>
            <p style="color: #8A95A5; font-size: 16px;">Where Scent Meets Style</p>
          </div>
          
          <h2 style="color: #E2E8F0; font-size: 24px; margin-bottom: 20px;">Dear ${name},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining the La Mèche community! Your exclusive 10% discount code is:
          </p>
          
          <div style="background: rgba(45, 212, 191, 0.1); border: 2px solid #2DD4BF; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0;">
            <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #2DD4BF; letter-spacing: 2px;">${code}</span>
          </div>
          
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p style="font-weight: bold; color: #EF4444; margin-bottom: 10px;">IMPORTANT:</p>
            <p style="margin: 0; font-size: 14px;">Please write down this serial code and tell it to us in person when purchasing. If this email doesn't come through, make sure to save this code.</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We'll notify you about available dates through posters around town and your local area.
          </p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(45, 212, 191, 0.3);">
            <p style="color: #8A95A5; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong style="color: #2DD4BF;">La Mèche Team</strong>
            </p>
          </div>
        </div>
      `
    };

    await mailService.send(msg);
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error('SendGrid email error:', error);
    throw error;
  }
}

function generateDiscountCode(): string {
  // Generate a 12-character Steam-like redemption code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static site
  app.get("/static", (req, res) => {
    res.sendFile(path.join(__dirname, "../static-site/complete.html"));
  });

  // Create preorder endpoint
  app.post("/api/preorders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertPreorderSchema.parse(req.body);
      
      // Check if email already exists
      const existingPreorder = await storage.getPreorderByEmail(validatedData.email);
      if (existingPreorder) {
        return res.status(400).json({ 
          message: "This email is already registered for preorder",
          discountCode: existingPreorder.discountCode 
        });
      }

      // Generate unique discount code
      let discountCode: string;
      let codeExists: boolean;
      do {
        discountCode = generateDiscountCode();
        const existing = await storage.getPreorderByCode(discountCode);
        codeExists = !!existing;
      } while (codeExists);

      // Create preorder
      const preorder = await storage.createPreorder(validatedData, discountCode);

      // Send email with discount code
      try {
        await sendDiscountCodeEmail(preorder.email, preorder.name, preorder.discountCode);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails, but log it
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

  // Get preorder by email (for checking existing preorders)
  app.get("/api/preorders/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const preorder = await storage.getPreorderByEmail(email);
      
      if (!preorder) {
        return res.status(404).json({ message: "Preorder not found" });
      }

      res.json({
        id: preorder.id,
        name: preorder.name,
        email: preorder.email,
        discountCode: preorder.discountCode,
        createdAt: preorder.createdAt
      });
    } catch (error) {
      console.error("Get preorder error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin endpoint to view preorder statistics
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getPreorderStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats retrieval error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all preorders (admin only - should be protected in production)
  app.get("/api/admin/preorders", async (req, res) => {
    try {
      const preorders = await storage.getAllPreorders();
      res.json(preorders);
    } catch (error) {
      console.error("Get all preorders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
