import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The Product class represents the MongoDB schema for products.
 * It extends the Mongoose Document class to inherit Mongoose document properties and methods.
 */
@Schema()
export class Product extends Document {
  /**
   * The name property stores the name of the product.
   * It is a required field, trimmed, and has a maximum length of 255 characters.
   */
  @Prop({ required: true, trim: true, maxlength: 255 })
  name: string;

  /**
   * The price property stores the price of the product.
   * It is a required field and has a minimum value of 0.
   */
  @Prop({ required: true, min: 0 })
  price: number;

  /**
   * The description property stores the description of the product.
   * It is an optional field and has a maximum length of 1000 characters.
   */
  @Prop({ maxlength: 1000 })
  description?: string;
}

/**
 * The ProductSchema is created using the SchemaFactory from the Product class.
 * It defines the structure of the Product documents in the MongoDB collection.
 */
export const ProductSchema = SchemaFactory.createForClass(Product);

/**
 * Creates an index on the name field to ensure it is unique.
 * This helps to prevent duplicate entries for products with the same name.
 */
ProductSchema.index({ name: 1 }, { unique: true });
