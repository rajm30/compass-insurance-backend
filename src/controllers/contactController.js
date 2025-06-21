const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { fullName, email, contactNumber, subject, message } = req.body;

    const contact = new Contact({
      fullName,
      email: email.toLowerCase(),
      contactNumber,
      subject,
      message,
    });

    const savedContact = await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit contact message",
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering options
    const filter = {};
    if (req.query.subject) {
      filter.subject = req.query.subject;
    }
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { message: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalContacts: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contacts",
    });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve contact",
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { fullName, email, contactNumber, subject, message } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        ...(fullName && { fullName }),
        ...(email && { email: email.toLowerCase() }),
        ...(contactNumber && { contactNumber }),
        ...(subject && { subject }),
        ...(message && { message }),
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update contact",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
