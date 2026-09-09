import { betterAuth } from "better-auth/next-js";
import { auth } from "./lib/auth";

export default betterAuth({ auth });