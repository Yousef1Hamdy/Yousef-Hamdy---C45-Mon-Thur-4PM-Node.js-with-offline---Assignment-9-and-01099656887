import mongoose, { Mongoose, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is require"],
      validate: {
        validator: function (title) {
          return title !== title.toUpperCase();
        },
        message: (props) => `${props.value} cannot be all uppercase letters!`,
      },
    },
    content: {
      type: String,
      required: [true, "Content is require"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const NoteModel =
  mongoose.models.Note || mongoose.model("Note", noteSchema);
