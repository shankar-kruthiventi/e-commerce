import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.usersService.verifyPassword(password, user.password);
      user.password = ''; // Remove password from the user object
      return user;
    } catch (error) {
      throw new HttpException(
        `Wrong credentials provided - ${JSON.stringify(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      console.log(user, '-------auth-service-user');
      return user;
    } catch (error) {
      throw new HttpException(
        `Error creating user - ${JSON.stringify(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /*  create(createAuthDto: CreateAuthDto) {
    console.log('This action adds a new user' + JSON.stringify(createAuthDto));
  } */

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth ${+JSON.stringify(updateAuthDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
