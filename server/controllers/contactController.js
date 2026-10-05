const Contact = require('../models/Contact');

const sendMockContactEmail = (contact) => {
  console.log(`\n======================================================================`);
  console.log(`📧 MOCK CONTACT FORM EMAIL NOTIFICATION SENT`);
  console.log(`To: sudharshanneela2006@gmail.com`);
  console.log(`From: ${contact.name} <${contact.email}>`);
  console.log(`Subject: SN FreshCart - Contact Inquiry: ${contact.subject}`);
  console.log(`----------------------------------------------------------------------`);
  console.log(`Message:`);
  console.log(contact.message);
  console.log(`======================================================================\n`);
};

// @desc    Submit a contact form query
// @route   POST /api/contact
// @access  Public
const submitContactQuery = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      return next(new Error('Please fill in all fields'));
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    const savedContact = await contact.save();

    // Send the simulated email
    sendMockContactEmail(savedContact);

    res.status(201).json({
      success: true,
      message: 'Your message has been received successfully!',
      data: savedContact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactQuery,
};
