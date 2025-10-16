import { Request, Response } from 'express';
import mongoose from 'mongoose';


const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  inquiryType: {
    type: String,
    required: true,
    enum: ['sales', 'support', 'partnership', 'general']
  },
  message: { type: String, required: true },
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'in-progress', 'resolved', 'closed']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, company, phone, inquiryType, message } = req.body;


    if (!firstName || !lastName || !email || !company || !phone || !inquiryType || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { return res.status(400).json({ success: false, message: 'Invalid email format' }); }


    const validInquiryTypes = ['sales', 'support', 'partnership', 'general'];
    if (!validInquiryTypes.includes(inquiryType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inquiry type'
      });
    }


    const contact = new Contact({ firstName, lastName, email, company, phone, inquiryType, message });

    await contact.save();

    console.log('New contact submission:', {
      id: contact._id,
      name: `${firstName} ${lastName}`,
      email,
      company,
      inquiryType
    });

    res.status(201).json({ success: true, message: 'Thank you for your message! We\'ll get back to you within 24 hours.', id: contact._id });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const inquiryType = req.query.inquiryType as string;

    const filter: any = {};
    if (status) filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'in-progress', 'resolved', 'closed', 'read'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false, message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.status(409).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact,
      message: 'Contact status updated successfully'
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};