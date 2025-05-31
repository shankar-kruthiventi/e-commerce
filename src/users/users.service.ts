import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const users: CreateUserDto[] = new Array(10).fill(Math.random()).map((user, index) => ({
      id: index,
      email: `example_${index}@gmail.com`,
      name: index.toString(),
      role: index % 2 === 0 ? 'admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const usersInstance = this.repo.create(users);
    await this.repo.save(usersInstance);
    return (
      'This action adds new users' + JSON.stringify(usersInstance) + JSON.stringify(createUserDto)
    );
  }

  async findAll() {
    console.log(`This action returns all users`);
    return this.repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${JSON.stringify(updateUserDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
