import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * The Inventory class represents the MongoDB schema for inventory items.
 * It extends the Mongoose Document class to inherit Mongoose document properties and methods.
 */
@Schema()
export class Inventory extends Document {
  /**
   * The productId property stores the ID of the product.
   * It is a required field and is of type ObjectId.
   */
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  /**
   * The quantity property stores the quantity of the product in the inventory.
   * It is a required field and has a minimum value of 0.
   */
  @Prop({ required: true, min: 0 })
  quantity: number;
}

/**
 * The InventorySchema is created using the SchemaFactory from the Inventory class.
 * It defines the structure of the Inventory documents in the MongoDB collection.
 */
export const InventorySchema = SchemaFactory.createForClass(Inventory);

/**
 * Creates an index on the productId field to ensure it is unique.
 * This helps to prevent duplicate entries for the same product.
 */
InventorySchema.index({ productId: 1 }, { unique: true });
