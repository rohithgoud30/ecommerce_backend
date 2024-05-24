import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * The Cart class represents the MongoDB schema for a shopping cart.
 * It extends the Mongoose Document class to inherit Mongoose document properties and methods.
 */
@Schema()
export class Cart extends Document {
  /**
   * The userId property stores the ID of the user who owns the cart.
   * It is a required field and is of type ObjectId.
   */
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  /**
   * The items property is an array of objects, each representing a product in the cart.
   * Each object contains a productId (of type ObjectId) and a quantity (of type Number).
   * This property is required.
   */
  @Prop({
    type: [{ productId: Types.ObjectId, quantity: Number }],
    required: true,
  })
  items: { productId: Types.ObjectId; quantity: number }[];
}

/**
 * The CartSchema is created using the SchemaFactory from the Cart class.
 * It defines the structure of the Cart documents in the MongoDB collection.
 */
export const CartSchema = SchemaFactory.createForClass(Cart);
