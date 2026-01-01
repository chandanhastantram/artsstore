import { Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  wishlist: any[];
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  profilePhoto: string;
  createdAt: Date;
  isActive: boolean;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  // Static methods can be added here if needed
}
