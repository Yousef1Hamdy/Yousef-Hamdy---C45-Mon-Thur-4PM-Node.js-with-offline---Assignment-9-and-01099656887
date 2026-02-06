import { Router } from "express";
import {
  signup,
  login,
  updateLoggedInUser,
  deleteUser,
  getUser,
} from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import { userAuth } from "../../middleware/userAuth.middleware.js";
const router = Router();

router.post("/signup", async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({
    res,
    status: 201,
    message: "Done signup",
    data: { result },
  });
});

router.post("/login", async (req, res, next) => {
  const result = await login(req.body);
  return successResponse({
    res,
    status: 200,
    message: "Done login",
    data: { result },
  });
});

router.patch("/",userAuth, async (req, res, next) => {
  
  const result = await updateLoggedInUser(req.user , req.body);
  return successResponse({
    res,
    status: 200,
    message: "User update",
    data: { result },
  });
});

router.delete("/",userAuth, async (req, res, next) => {

  const result = await deleteUser(req.user);
  return successResponse({
    res,
    status: 200,
    message: "User deleted successfully",
    data: { result },
  });
});

router.get("/",userAuth, async (req, res, next) => {

  const result = await getUser(req.user);
  return successResponse({
    res,
    status: 200,
    message: "user get successfully",
    data:  result ,
  });
});


export default router;
