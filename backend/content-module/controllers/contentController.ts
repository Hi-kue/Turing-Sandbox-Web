// src/modules/user/controllers/userController.ts
import { Request, Response } from "express";
import { ContentService } from "../services/serviceContent";
import { IncomingForm } from "formidable";
import { StorageService } from "../../storage-module/services/serviceStorage";

export class ContentController {
  static async createContent(req: Request, res: Response) {
    console.log("Creating Content...");
    const { creatorUID, title, content, thumbnailUrl } = req.body;

    try {
      const response = await ContentService.createContent(
        creatorUID,
        title,
        content,
        thumbnailUrl
      );
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to create content" });
    }
  }

  static async uploadThumbnail(req: Request, res: Response) {
    console.log("Uploading Thumbnail...");

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form: ", err);
        return res.status(500).json({ error: "Failed to upload thumbnail." });
      }

      const file = files.thumbnail[0];
      const fileName = file.newFilename;
      const fileType = file.mimetype;

      // Upload thumbnail to storage
      try {
        // Upload thumbnail
        const response = await StorageService.uploadFile(
          file,
          "thumbnails",
          fileName,
          fileType
        );
        res.status(201).json(response);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ error: error.message || "Failed to upload thumbnail" });
      }
    });
  }

  static async getContent(req: Request, res: Response) {
    console.log("Fetching Content...");
    const { contentId } = req.params;

    try {
      const response = await ContentService.getContent(contentId);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch content" });
    }
  }

  // Like content
  static async likeContent(req: Request, res: Response) {
    console.log("Liking Content...");
    const { contentId, userId } = req.params;

    try {
      const response = await ContentService.likeContent(contentId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error liking content:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to like content",
        stack: error instanceof Error ? error.stack : null
      });
    }
  } 
  
  // Unlike content
  static async unlikeContent(req: Request, res: Response) {
    const { contentId, userId } = req.params;

    try {
      const response = await ContentService.unlikeContent(contentId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error unliking content:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to unlike content",
      });
    }
  }

  // Bookmark content
  static async bookmarkContent(req: Request, res: Response) {
    const { contentId, userId } = req.params;

    try {
      const response = await ContentService.bookmarkContent(contentId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error bookmarking content:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to bookmark content",
      });
    }
  }

  // Unbookmark content
  static async unbookmarkContent(req: Request, res: Response) {
    const { contentId, userId } = req.params;

    try {
      const response = await ContentService.unbookmarkContent(contentId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error unbookmarking content:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to unbookmark content",
      });
    }
  }
}