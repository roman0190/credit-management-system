import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from 'src/auth/login.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  async createUser(@Body() createUserDto: LoginDto) {
    try {
      // Call the UsersService to create a new user
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  // @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }
}
