import { Request, Response } from 'express';
import { RepairRequest } from '../models/Request';

export const createRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, location, contact, category, priority } = req.body;
    const newRequest = new RepairRequest({
      description,
      location,
      contact,
      category,
      priority,
      clientId: req.user._id
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Błąd tworzenia zgłoszenia:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    let query: any = {};
    
    // Filter by role
    if (req.user.role === 'client') {
      query.clientId = req.user._id;
    } else if (req.user.role === 'handyman') {
      query.handymanId = req.user._id;
    }

    const requests = await RepairRequest.find(query)
      .sort({ submittedAt: -1 })
      .populate('clientId', 'name email')
      .populate('handymanId', 'name email');
    
    res.json(requests);
  } catch (error) {
    console.error('Błąd pobierania zgłoszeń:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await RepairRequest.findById(req.params.id)
      .populate('clientId', 'name email')
      .populate('handymanId', 'name email');

    if (!request) {
      res.status(404).json({ message: 'Zgłoszenie nie znalezione' });
      return;
    }

    // Check if user has access to this request
    if (req.user.role === 'client' && request.clientId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Brak dostępu do tego zgłoszenia' });
      return;
    }

    res.json(request);
  } catch (error) {
    console.error('Błąd pobierania zgłoszenia:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, handymanId, notes } = req.body;
    const request = await RepairRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ message: 'Zgłoszenie nie znalezione' });
      return;
    }

    // Check if user has permission to update
    if (req.user.role === 'client' && request.clientId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Brak uprawnień do aktualizacji tego zgłoszenia' });
      return;
    }

    // Update fields
    if (status) request.status = status;
    if (handymanId) request.handymanId = handymanId;
    if (notes) request.notes = notes;
    request.updatedAt = new Date();

    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Błąd aktualizacji statusu zgłoszenia:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
}; 