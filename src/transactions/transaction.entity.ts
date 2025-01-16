import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ default: 'pending' }) // Status: pending, approved, rejected
  status: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
