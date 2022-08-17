import { Injectable } from '@nestjs/common';
import { sign } from 'crypto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}
  
  async signPayload(payload: any) {
    return sign(payload, process.env.SECRET_KEY || '', { expiresIn: '7d' });
  }
}
