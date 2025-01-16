import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto): Promise<User> {
    const { username, password, role = 'admin', credit = 0 } = createUserDto;

    // Check if the username already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Create a new user instance
    const user = this.userRepository.create({
      username,
      password,
      role,
      credit,
    });

    // Save the user to the database
    return this.userRepository.save(user);
  }

  // Method to get a user by username
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username: username },
      relations: ['transactions'], // Explicitly include related transactions
    });
  }

  async findOneById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserCredit(userId: number, amount: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.credit += amount;
    return this.userRepository.save(user);
  }
}
