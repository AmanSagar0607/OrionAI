import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
};

export const requireAdmin = async () => {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return user;
};
