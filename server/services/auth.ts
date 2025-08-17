import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredLanguage?: 'uz' | 'ru';
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async registerUser(data: RegisterData) {
    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error('Bu email manzil allaqachon ishlatilmoqda');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          id: nanoid(),
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          phone: data.phone || null,
          preferredLanguage: data.preferredLanguage || 'uz',
          authProvider: 'email',
        })
        .returning();

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async loginUser(data: LoginData) {
    try {
      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (!user || !user.password) {
        throw new Error('Email yoki parol noto\'g\'ri');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email yoki parol noto\'g\'ri');
      }

      // Update last login time
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async adminLogin(username: string, password: string) {
    try {
      // Check for predefined admin credentials
      if (username === 'Akramjon' && password === 'GIsobot201415*') {
        // Check if admin user exists
        let [adminUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, 'admin@optombazar.uz'))
          .limit(1);

        if (!adminUser) {
          // Create admin user if doesn't exist
          const newAdmin = await this.createAdminUser('admin@optombazar.uz', 'GIsobot201415*');
          adminUser = { ...newAdmin, password: null }; // Match expected type
        }

        // Update last login time
        await db
          .update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, adminUser.id));

        const { password: _, ...userWithoutPassword } = adminUser;
        return userWithoutPassword;
      } else {
        throw new Error('Noto\'g\'ri admin ma\'lumotlari');
      }
    } catch (error) {
      throw error;
    }
  }

  async createAdminUser(email: string, password: string) {
    try {
      const hashedPassword = await this.hashPassword(password);
      
      const [adminUser] = await db
        .insert(users)
        .values({
          id: nanoid(),
          email,
          password: hashedPassword,
          firstName: 'Akramjon',
          lastName: 'Admin',
          isAdmin: true,
          authProvider: 'email',
          preferredLanguage: 'uz',
        })
        .returning();

      const { password: _, ...userWithoutPassword } = adminUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) return null;

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }

  async updateUserLanguage(userId: string, language: 'uz' | 'ru') {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({ 
          preferredLanguage: language,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('Foydalanuvchi topilmadi');
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();