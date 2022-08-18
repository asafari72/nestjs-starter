import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './register.dto';
import { LoginDTO } from '../auth/login.dto';
import { Payload } from '../types/payload';
import { User } from '../types/user';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<User>,
      ) {}
    
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
      async findByPayload(payload: Payload) {
        const { username } = payload;
        return await this.userModel.findOne({ username });
      }
      
      async findByLogin(UserDTO: LoginDTO) {
        const { username, password } = UserDTO;
        const user = await this.userModel.findOne({ username });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
          return this.sanitizeUser(user)
        } else {
          throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
      }
      sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
      }

}