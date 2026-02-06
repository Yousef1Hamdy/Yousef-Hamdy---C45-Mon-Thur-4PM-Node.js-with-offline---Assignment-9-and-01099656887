import { Router } from "express";
import { userAuth } from "../../middleware/userAuth.middleware.js";
import { successResponse } from "../../common/index.js";
import {
  createPost,
  deleteAllNote,
  deleteNote,
  getAllNotesWithUserInfo,
  getAllNotesWithUserInfoBYtitle,
  getNodeByContent,
  getNodeById,
  getPaginatedSortedNotes,
  replaceNote,
  updateAllNoteByOwner,
  updateNote,
} from "./node.service.js";

const router = Router();

router.post("/", userAuth, async (req, res, next) => {
  const result = await createPost(req.user, req.body);
  return successResponse({
    res,
    status: 201,
    message: "Note created successfully",
    data: result,
  });
});

router.patch("/all", userAuth, async (req, res, next) => {
  const result = await updateAllNoteByOwner(req.user, req.body);
  return successResponse({
    res,
    status: 200,
    message: "all notes Update",
    data: result,
  });
});

router.patch("/:noteId", userAuth, async (req, res, next) => {
  const { noteId } = req.params;
  const result = await updateNote(req.user, noteId, req.body);
  return successResponse({
    res,
    status: 200,
    message: "Note updated successfully",
    data: result,
  });
});

router.put("/replace/:noteId", userAuth, async (req, res, next) => {
  const { noteId } = req.params;
  const result = await replaceNote(req.user, noteId, req.body);
  return successResponse({
    res,
    status: 200,
    message: "Note replace successfully",
    data: result,
  });
});



router.delete("/:noteId", userAuth, async (req, res, next) => {
  const { noteId } = req.params;
  const result = await deleteNote(req.user, noteId);
  return successResponse({
    res,
    status: 200,
    message: "Note deleted successfully",
    data: result,
  });
});

router.get("/paginate-sort", userAuth, async (req, res, next) => {
  const result = await getPaginatedSortedNotes(req.user, req.query);
  return successResponse({
    res,
    status: 200,
    message: "Note deleted successfully",
    data: result,
  });
});

router.get("/note-by-content", userAuth, async (req, res, next) => {
  const { content } = req.query;
  console.log(content);
  const result = await getNodeByContent(req.user, req.query);
  return successResponse({
    res,
    status: 200,
    message: "get note by content",
    data: result,
  });
});

router.get("/note-with-user", userAuth, async (req, res, next) => {
  const result = await getAllNotesWithUserInfo(req.user);
  return successResponse({
    res,
    status: 200,
    message: "join user and note",
    data: result,
  });
});

router.get("/aggregate", userAuth, async (req, res, next) => {
    const {title} = req.query;
  const result = await getAllNotesWithUserInfoBYtitle(req.user , title);
  return successResponse({
    res,
    status: 200,
    message: "join user and note and search by title",
    data: result,
  });
});

router.get("/:noteId", userAuth, async (req, res, next) => {
  const { noteId } = req.params;
  const result = await getNodeById(req.user, noteId);
  return successResponse({
    res,
    status: 200,
    message: "get note by id",
    data: result,
  });
});


router.delete("/", userAuth, async (req, res, next) => {
  const result = await deleteAllNote(req.user);
  return successResponse({
    res,
    status: 200,
    message: "delete all note",
    data: result,
  });
});



export default router;
