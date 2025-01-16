import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  // Create a new transaction
  @Post('create')
  // @UseGuards(JwtAuthGuard) // Use JWT Guard to authenticate
  async createTransaction(@Body() body: { userId: number; amount: number }) {
    const transaction = await this.transactionsService.createTransaction(
      body.userId,
      body.amount,
    );
    return transaction;
  }

  // Approve a transaction by ID
  @Post('approve/:id')
  // @UseGuards(JwtAuthGuard) // Use JWT Guard to authenticate
  async approveTransaction(@Param('id') id: number) {
    const transaction = await this.transactionsService.approveTransaction(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  // Reject a transaction by ID
  @Post('reject/:id')
  // @UseGuards(JwtAuthGuard) // Use JWT Guard to authenticate
  async rejectTransaction(@Param('id') id: number) {
    const transaction = await this.transactionsService.rejectTransaction(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  // Get all transactions
  @Get()
  // @UseGuards(JwtAuthGuard) // Use JWT Guard to authenticate
  async getTransactions() {
    const transactions = await this.transactionsService.getTransactions();
    return transactions;
  }
}
