import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',       //replace with your PostgreSQL username
      password: '123456789',   //replace with your PostgreSQL password
      database: 'sbms_db',         //replace with your PostgreSQL database name
      autoLoadEntities: true,
      synchronize: true,           //creates all tables in PostgreSQL
    }),
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}