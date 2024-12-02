import { Router } from "express";
import { ContentController } from "../controllers/contentController";

const contentRoutes = Router();

contentRoutes.post("/", ContentController.createContent); // Create new content
contentRoutes.post("/uploadThumbnail", ContentController.uploadThumbnail); // Upload thumbnail

contentRoutes.get("/:contentId", ContentController.getContent); // Get content by ID

contentRoutes.post("/:contentId/like/:userId", ContentController.likeContent); // Like content
contentRoutes.post("/:contentId/unlike/:userId", ContentController.unlikeContent); // Unlike content

contentRoutes.post("/:userId/bookmark/:contentId", ContentController.bookmarkContent); // Bookmark content
contentRoutes.post("/:userId/unbookmark/:contentId", ContentController.unbookmarkContent); // Unbookmark content

export default contentRoutes;
