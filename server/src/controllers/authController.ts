import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, name, role = 'client', phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: 'Użytkownik z tym emailem lub nazwą użytkownika już istnieje' });
      return;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      name,
      role,
      phone,
      address
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Nieprawidłowa nazwa użytkownika lub hasło' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Nieprawidłowa nazwa użytkownika lub hasło' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Użytkownik nie znaleziony' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Błąd pobierania profilu:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'Użytkownik nie znaleziony' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Błąd aktualizacji profilu:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
}; 