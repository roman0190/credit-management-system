import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/user.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    // ConfigModule for environment variable management
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available throughout the application
    }),
    // TypeOrmModule with configuration sourced from ConfigService
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Transaction],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
    }),
    // Application modules
    AuthModule,
    UsersModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
