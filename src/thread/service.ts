import { Types } from "mongoose";

import { Thread, ThreadModel } from ".";

export const thread = async (
  id: string
): Promise<Thread | undefined | null> => {
  return ThreadModel.findOne({ _id: new Types.ObjectId(id) })
};

export const threads = async (): Promise<Thread[]> => {
  return ThreadModel.find();
};
