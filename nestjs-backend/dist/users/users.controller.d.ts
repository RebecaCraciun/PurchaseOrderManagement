import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from '../common/types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: UserRole): Promise<User[]>;
    findOne(id: string): Promise<User>;
}
