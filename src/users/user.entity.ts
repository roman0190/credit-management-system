import { Transaction } from '../transactions/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string; // user/admin

  @Column({ default: 0 })
  credit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
