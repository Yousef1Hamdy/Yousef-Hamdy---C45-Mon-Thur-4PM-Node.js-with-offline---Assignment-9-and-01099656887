import {
  BadRequestException,
  compareHash,
  ConflictException,
  decrypt,
  encrypt,
  generateHash,
  generateToken,
  NotFoundException,
} from "../../common/index.js";
import { UserModel } from "../../DB/model/index.js";

export const signup = async (inputs) => {
  const { name, email, password, phone, age } = inputs;
  const checkUserExist = await UserModel.findOne({ email });
  if (checkUserExist) {
    throw ConflictException( "Email exist" );
  }
  const [user] = await UserModel.create([
    {
      name,
      email,
      password: await generateHash({ plaintext: password }),
      phone: await encrypt(phone),
      age,
    },
  ]);

  return user;
};

export const login = async (inputs) => {
  const { email, password } = inputs;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw NotFoundException( "invalid email or password" );
  }

  const match = compareHash({ cipherText: user.password, plaintext: password });

  if (!match) {
    throw UnauthorizedException( "Invalid email or password" );
  }

  const token = generateToken({ payload: { user_id: user?._id.toString() } });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone ? await decrypt(user.phone) : null,
      age: user.age,
    },
    token,
  };
};

export const updateLoggedInUser = async (reqUser, inputs) => {
  const { user_id } = reqUser;
  const { email, name, phone, password } = inputs;

  if (password) {
    throw BadRequestException( "Password update is not allowed here");
  }

  const user = await UserModel.findById(user_id);
  if (!user) {
    throw NotFoundException( "user not found" );
  }

  if (email && email !== user.email) {
    const emailExists = await UserModel.findOne({
      email,
      _id: { $ne: user_id },
    });
    if (emailExists) {
      throw ConflictException( "Email already exists" );
    }
  }
  const updateData = {};

  if (name && name !== user.name && name.length > 2) updateData.name = name;
  if (email) updateData.email = email;
  if (phone && phone !== (await decrypt(user.phone)))
    updateData.phone = await encrypt(phone);

  const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

export const deleteUser = async (reqUser) => {
  const { user_id } = reqUser;

  const user = await UserModel.findById(user_id);
  if (!user) {
    throw NotFoundException( "user not found" );
  }

  const deleteUser = await UserModel.deleteOne({ _id: user_id });

  return deleteUser;
};

export const getUser = async (reqUser) => {
  const { user_id } = reqUser;

  const user = await UserModel.findById(user_id).select("-password");
  if (!user) {
    throw NotFoundException( "user not found" );
  }
 const userObject = user.toObject();
  return {
    user: {
      ...userObject,
      phone: user.phone ? await decrypt(userObject.phone) : null,
    },
  };
};
