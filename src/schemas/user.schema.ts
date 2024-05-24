import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The User class represents the MongoDB schema for users.
 * It extends the Mongoose Document class to inherit Mongoose document properties and methods.
 */
@Schema()
export class User extends Document {
  /**
   * The email property stores the email address of the user.
   * It is a required field and must be unique to ensure no duplicate email addresses are stored.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * The password property stores the hashed password of the user.
   * It is a required field.
   */
  @Prop({ required: true })
  password: string;

  /**
   * The name property stores the name of the user.
   * It is a required field.
   */
  @Prop({ required: true })
  name: string;
}

/**
 * The UserSchema is created using the SchemaFactory from the User class.
 * It defines the structure of the User documents in the MongoDB collection.
 */
export const UserSchema = SchemaFactory.createForClass(User);
