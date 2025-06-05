import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(crypto.scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }
    const user = this.repo.create({ ...createUserDto });
    const salt = crypto.randomBytes(16).toString('hex');
    const hashBuffer = (await scrypt(
      createUserDto.password,
      Buffer.from(salt, 'hex'),
      64,
    )) as Buffer;
    user.password = `${salt}:${hashBuffer.toString('hex')}`;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    const savedUser = await this.repo.save(user);
    savedUser.password = ''; // Remove password from the user object
    return savedUser;
  }

  async getByEmail(email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    const user = await this.repo.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const [salt, hash] = hashedPassword.split(':');
    const hashBuffer = (await scrypt(plainTextPassword, Buffer.from(salt, 'hex'), 64)) as Buffer;
    return hash === hashBuffer.toString('hex');
  }

  async create(createUserDto: CreateUserDto) {
    const users: CreateUserDto[] = new Array(10).fill(Math.random()).map((user, index) => ({
      id: index,
      email: `example_${index}@gmail.com`,
      password: 'password' + index,
      name: index.toString(),
      role: index % 2 === 0 ? 'admin' : 'user',
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
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
