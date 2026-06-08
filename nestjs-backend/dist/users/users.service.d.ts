import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../common/types';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByRole(role: UserRole): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
}
