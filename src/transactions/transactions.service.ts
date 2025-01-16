import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
  ) {}
  // Method to create a transaction
  async createTransaction(
    userId: number,
    amount: number,
  ): Promise<Transaction> {
    // Check if the user exists
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create a new transaction object
    const transaction = this.transactionRepository.create({
      user: user, // Linking the user to the transaction
      amount,
      status: 'pending', // By default, set the status as 'pending'
    });

    // Save the transaction in the database
    return this.transactionRepository.save(transaction);
  }

  // Method to approve a transaction
  async approveTransaction(transactionId: number): Promise<Transaction> {
    // Find the transaction by ID
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['user'], // Load related user to update credit
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Update the transaction status to 'approved'
    transaction.status = 'approved';

    // Update the user's credit
    await this.usersService.updateUserCredit(
      transaction.user.id,
      transaction.amount,
    );

    // Save and return the updated transaction
    return this.transactionRepository.save(transaction);
  }

  // Method to reject a transaction
  async rejectTransaction(transactionId: number): Promise<Transaction> {
    // Find the transaction by ID
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Update the transaction status to 'rejected'
    transaction.status = 'rejected';

    // Save and return the updated transaction
    return this.transactionRepository.save(transaction);
  }

  // Method to get all transactions
  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find({ relations: ['user'] }); // Load related user data
  }
}
