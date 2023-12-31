import { getSelectData, unGetSelectData } from "../../utils";
import discount from "../discount.model";

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}: any) => {
  const skip = page && limit ? (page - 1) * limit : 0;

  const sortBy: any = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit!)
    .select(unGetSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}: any) => {
  const skip = page && limit ? (page - 1) * limit : 0;

  const sortBy: any = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit!)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExist = async (model: any, filter: any) => {
  return await discount.findOne(filter);
};

export {
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExist,
};
