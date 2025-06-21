const Quote = require("../models/Quote");

const createQuote = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, insuranceType, additionalInfo } =
      req.body;

    // Check if quote with same email already exists for the same insurance type
    const existingQuote = await Quote.findOne({
      email: email.toLowerCase(),
      insuranceType,
    });

    // if (existingQuote) {
    //   return res.status(409).json({
    //     success: false,
    //     message:
    //       "A quote request for this insurance type already exists with this email",
    //   });
    // }

    const quote = new Quote({
      fullName,
      email: email.toLowerCase(),
      phoneNumber,
      insuranceType,
      additionalInfo,
    });

    const savedQuote = await quote.save();

    res.status(201).json({
      success: true,
      message: "Quote request submitted successfully",
      data: savedQuote,
    });
  } catch (error) {
    console.error("Error creating quote:", error);

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
      message: "Failed to submit quote request",
    });
  }
};

const getAllQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;    // Filtering options
    const filter = {};
    if (req.query.insuranceType) {
      filter.insuranceType = req.query.insuranceType;
    }
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { additionalInfo: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Quotes retrieved successfully",
      data: {
        quotes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalQuotes: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quotes",
    });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quote retrieved successfully",
      data: quote,
    });
  } catch (error) {
    console.error("Error fetching quote:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve quote",
    });
  }
};

const updateQuote = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, insuranceType, additionalInfo } =
      req.body;

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Check if email is being changed and if it conflicts with existing quote
    if (email && email.toLowerCase() !== quote.email) {
      const existingQuote = await Quote.findOne({
        email: email.toLowerCase(),
        insuranceType: insuranceType || quote.insuranceType,
        _id: { $ne: req.params.id },
      });

      if (existingQuote) {
        return res.status(409).json({
          success: false,
          message:
            "A quote request for this insurance type already exists with this email",
        });
      }
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        ...(fullName && { fullName }),
        ...(email && { email: email.toLowerCase() }),
        ...(phoneNumber && { phoneNumber }),
        ...(insuranceType && { insuranceType }),
        ...(additionalInfo !== undefined && { additionalInfo }),
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      data: updatedQuote,
    });
  } catch (error) {
    console.error("Error updating quote:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID format",
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
      message: "Failed to update quote",
    });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    await Quote.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quote:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete quote",
    });
  }
};

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
};
