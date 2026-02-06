import mongoose from "mongoose";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/index.js";
import { NoteModel, UserModel } from "../../DB/model/index.js";

export const createPost = async (userReq, inputs) => {
  const { user_id } = userReq;
  const { title, content } = inputs;
  //  validation
  if (!title || !content) {
    throw BadRequestException("Title and content are required");
  }

  const user = await UserModel.findById(user_id).select("-password");
  if (!user) {
    throw NotFoundException("user not found");
  }

  const note = await NoteModel.create({ title, content, userId: user_id });

  return note;
};

export const updateNote = async (userReq, noteId, inputs) => {
  const { user_id } = userReq;
  const { title, content } = inputs;
  //  validation
  if (!title || !content) {
    throw BadRequestException("Title and content are required");
  }

  const user = await UserModel.findById(user_id);
  if (!user) {
    throw NotFoundException("user not found");
  }

  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw NotFoundException("Note not found");
  }

  if (note.userId.toString() !== user_id) {
    throw UnauthorizedException("You not the owner");
  }

  if (title !== note.title) note.title = title;
  if (content !== note.content) note.content = content;

  await note.save();

  return note;
};

export const replaceNote = async (userReq, noteId, inputs) => {
  const { user_id } = userReq;
  const { title, content } = inputs;
  //  validation
  if (!title || !content) {
    throw BadRequestException("Title and content are required");
  }

  const user = await UserModel.findById(user_id);
  if (!user) {
    throw NotFoundException("user not found");
  }

  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw NotFoundException("Note not found");
  }

  if (note.userId.toString() !== user_id) {
    throw UnauthorizedException("You not the owner");
  }

  const replacedNote = await NoteModel.findOneAndReplace(
    { _id: noteId, userId: user_id },
    {
      title,
      content,
      userId: user_id, // owner stays same
    },
    { new: true, runValidators: true },
  );
  if (!replacedNote) {
    throw NotFoundException("Note not found or not yours");
  }
  return replacedNote;
};

export const updateAllNoteByOwner = async (userReq, inputs) => {
  const { user_id } = userReq;
  const { title } = inputs;
  //  validation
  if (!title) {
    throw BadRequestException("Title  are required");
  }

  const updateAllNote = await NoteModel.updateMany(
    { userId: user_id },
    {
      title,
    },
    { runValidators: true },
  );

  if (updateAllNote.matchedCount === 0) {
    throw NotFoundException("no notes found");
  }
  return updateAllNote;
};

export const deleteNote = async (userReq, noteId) => {
  const { user_id } = userReq;

  const note = await NoteModel.findOneAndDelete({
    userId: user_id,
    _id: noteId,
  });

  if (note.deletedCount === 0) {
    throw NotFoundException("no notes found");
  }

  return note;
};

export const getPaginatedSortedNotes = async (userReq, inputs) => {
  const { user_id } = userReq;
  let { page, limit } = inputs;

  page = Math.max(1, Number(page));
  limit = Math.max(1, Number(limit));
  const skip = (page - 1) * limit;

  const notes = await NoteModel.find({
    userId: user_id,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalNotes = await NoteModel.countDocuments({
    userId: user_id,
  });

  if (!notes.length) {
    throw NotFoundException("No notes found");
  }

  return {
    page,
    limit,
    totalNotes,
    totalPages: Math.ceil(totalNotes / limit),
    notes,
  };
};

export const getNodeById = async (userReq, noteId) => {
  const { user_id } = userReq;
  console.log(noteId);
  const note = await NoteModel.findOne({ _id: noteId, userId: user_id });

  if (!note) {
    throw NotFoundException("Note not found");
  }

  if (note.userId.toString() !== user_id) {
    throw UnauthorizedException("You not the owner");
  }

  return note;
};

export const getNodeByContent = async (userReq, inputs) => {
  const { user_id } = userReq;
  const { content } = inputs;
  //   console.log(content);
  const note = await NoteModel.findOne({ content, userId: user_id });
  if (!note) {
    throw NotFoundException("Note not found");
  }

  if (note.userId.toString() !== user_id) {
    throw UnauthorizedException("You not the owner");
  }

  return note;
};

export const getAllNotesWithUserInfo = async (userReq) => {
  const { user_id } = userReq;

  const notes = await NoteModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.email": 1,
      },
    },
  ]);

  if (!notes.length) {
    throw NotFoundException("No notes found");
  }

  return notes;
};

export const getAllNotesWithUserInfoBYtitle = async (userReq, title) => {
  const { user_id } = userReq;

  const notes = await NoteModel.aggregate([
    {
      $match: {
        title,
        userId: new mongoose.Types.ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.email": 1,
        "user.name": 1,
      },
    },
  ]);

  if (!notes.length) {
    throw NotFoundException("No notes found");
  }

  return notes;
};

export const deleteAllNote = async (userReq) => {
  const { user_id } = userReq;
  const notes = await NoteModel.deleteMany({ userId: user_id });

  if (notes.deletedCount === 0) {
    throw NotFoundException("no notes found");
  }
  return {
    message: "All notes deleted successfully",
    deletedCount: notes.deletedCount,
  };
};
