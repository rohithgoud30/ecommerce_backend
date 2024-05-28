import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory } from '../schemas/inventory.schema';
import { CreateInventoryDTO } from '../dtos/create-inventory.dto';
import { UpdateInventoryDTO } from '../dtos/update-inventory.dto';
import { Server } from 'socket.io';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private server: Server;

  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
  ) {}

  /**
   * Set the Socket.IO server instance.
   * @param server The Socket.IO server instance.
   */
  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Retrieve all inventory items.
   * @returns A promise that resolves to an array of inventory items.
   */
  async findAll(): Promise<Inventory[]> {
    try {
      return await this.inventoryModel.find().exec();
    } catch (error) {
      this.logger.error('Error finding all inventory items', error);
      throw error;
    }
  }

  /**
   * Retrieve a single inventory item by its ID.
   * @param id The ID of the inventory item.
   * @returns A promise that resolves to the inventory item.
   */
  async findOne(id: string): Promise<Inventory> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid inventory ID');
      }
      return await this.inventoryModel.findById(id).exec();
    } catch (error) {
      this.logger.error(`Error finding inventory item with id ${id}`, error);
      throw error;
    }
  }

  /**
   * Create a new inventory item.
   * @param inventory The data transfer object for creating an inventory item.
   * @returns A promise that resolves to the created inventory item.
   */
  async create(inventory: CreateInventoryDTO): Promise<Inventory> {
    try {
      const createdInventory = new this.inventoryModel(inventory);
      const savedInventory = await createdInventory.save();
      this.server?.emit('inventoryUpdate', savedInventory);
      return savedInventory;
    } catch (error) {
      this.logger.error('Error creating inventory item', error);
      throw error;
    }
  }

  /**
   * Update an existing inventory item.
   * @param id The ID of the inventory item.
   * @param inventory The data transfer object for updating an inventory item.
   * @returns A promise that resolves to the updated inventory item.
   */
  async update(id: string, inventory: UpdateInventoryDTO): Promise<Inventory> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid inventory ID');
      }
      const existingInventory = await this.inventoryModel.findById(id).exec();
      if (!existingInventory) {
        throw new Error('Inventory item not found');
      }
      if (inventory.quantity !== undefined) {
        existingInventory.quantity = inventory.quantity;
      }
      if (inventory.productId) {
        existingInventory.productId = inventory.productId as any;
      }
      const updatedInventory = await existingInventory.save();
      this.server?.emit('inventoryUpdate', updatedInventory);
      return updatedInventory;
    } catch (error) {
      this.logger.error(`Error updating inventory item with id ${id}`, error);
      throw error;
    }
  }

  /**
   * Remove an inventory item by its ID.
   * @param id The ID of the inventory item.
   * @returns A promise that resolves to the removed inventory item.
   */
  async remove(id: string): Promise<Inventory> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid inventory ID');
      }
      const deletedInventory = await this.inventoryModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedInventory) {
        throw new Error('Inventory item not found');
      }
      this.server?.emit('inventoryUpdate', { id, deleted: true });
      return deletedInventory;
    } catch (error) {
      this.logger.error(`Error deleting inventory item with id ${id}`, error);
      throw error;
    }
  }

  /**
   * Add or update the quantity of an inventory item.
   * @param id The ID of the inventory item.
   * @param inventory The data transfer object for updating the inventory quantity.
   * @returns A promise that resolves to the updated inventory item.
   */
  async addOrUpdateQuantity(
    id: string,
    inventory: UpdateInventoryDTO,
  ): Promise<Inventory> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid inventory ID');
      }
      const existingInventory = await this.inventoryModel.findById(id).exec();
      if (existingInventory) {
        if (inventory.quantity !== undefined) {
          existingInventory.quantity += inventory.quantity;
        }
        if (inventory.productId) {
          existingInventory.productId = inventory.productId as any;
        }
        const updatedInventory = await existingInventory.save();
        this.server?.emit('inventoryUpdate', updatedInventory);
        return updatedInventory;
      } else {
        throw new Error('Inventory item not found');
      }
    } catch (error) {
      this.logger.error('Error updating inventory quantity', error);
      throw error;
    }
  }

  /**
   * Reset the quantity of an inventory item to zero.
   * @param id The ID of the inventory item.
   * @returns A promise that resolves to the updated inventory item.
   */
  async resetQuantity(id: string): Promise<Inventory> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid inventory ID');
      }
      const updatedInventory = await this.inventoryModel
        .findByIdAndUpdate(id, { quantity: 0 }, { new: true })
        .exec();
      if (!updatedInventory) {
        throw new Error('Inventory item not found');
      }
      this.server?.emit('inventoryUpdate', updatedInventory);
      return updatedInventory;
    } catch (error) {
      this.logger.error(`Error resetting inventory item with id ${id}`, error);
      throw error;
    }
  }
}
