import { result } from "lodash";
import { BadRequestError, NotFoundError } from "../core/error.response";
import discount from "../models/discount.model";
import {
  findAllDiscountCodesUnselect,
  checkDiscountExist,
} from "../models/repositories/discount.repo";
import { findAllProducts } from "../models/repositories/product.repo";
import { DiscountAmountType } from "../types/services/discount.types";

class DiscountService {
  static async createDiscountCode(payload: any) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expired");
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // Create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getProductsByDiscountCode({ code, shopId, limit, page }: any) {
    // Create index for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products;
    if (discount_applies_to === "all") {
      //Get all products
      products = await findAllProducts({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      //Get the products id
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // Get  all discount of Shop

  static async getAllDiscountCodesByShop({ limit, page, shopId }: any) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  static async getDiscountAmount({
    code,
    userId,
    shopId,
    products,
  }: DiscountAmountType) {
    const foundDiscount = await checkDiscountExist(discount, {
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new BadRequestError("Discount expired!");
    if (discount_max_uses === 0)
      throw new BadRequestError("Discount has been used up!");

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > discount_end_date
    // ) {
    //   throw new BadRequestError("Discount code has expired");
    // }

    // Check min values of products
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce(
        (total, product) => total + product.quantity * product.price,
        0
      );
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          "Total price of products is not enough, minimum is " +
            discount_min_order_value
        );
      }
    }

    // Check user already used discount
    if (discount_max_uses_per_user === 1) {
      const foundUser = discount_users_used.find(
        (user_id) => user_id === userId
      );
      if (foundUser)
        throw new BadRequestError("You have used this discount code!");
      foundDiscount.discount_users_used.push(userId);
      await foundDiscount.save();
    }

    const discountAmount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    foundDiscount.discount_max_uses -= 1;
    foundDiscount.discount_uses_count += 1;
    await foundDiscount.save();

    return {
      discount: discountAmount,
      totalOrder,
      newTotalOrder: totalOrder - discountAmount,
    };
  }

  static async deleteDiscountCode({
    codeId,
    shopId,
  }: {
    codeId: string;
    shopId: string;
  }) {
    const deleted = await discount.findOneAndDelete({
      _id: codeId,
      discount_shopId: shopId,
    });

    return deleted;
  }

  static async cancleDiscountCode({ code, shopId, userId }: any) {
    const foundDiscount = await checkDiscountExist(discount, {
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const result = await discount.findOneAndUpdate(
      {
        discount_code: code,
        discount_shopId: shopId,
      },
      {
        $pull: {
          discount_users_used: userId,
        },
        $inc: {
          discount_max_uses: 1,
          discount_uses_count: -1,
        },
      },
      {
        new: true,
      }
    );

    return result;
  }
}

export default DiscountService;
