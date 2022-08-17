import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { RegisterDTO } from './register.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async create(registerDTO: RegisterDTO) {
        const { username } = registerDTO;
        const user = await this.userModel.findOne({ username });
        if (user) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
        const createdUser = new this.userModel(registerDTO);
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }
   // return user object without password
      sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
      }
}
