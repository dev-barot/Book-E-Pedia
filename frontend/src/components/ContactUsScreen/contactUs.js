import React, { useState } from "react";
import "./contactUs.css"; // Import your CSS file for styling

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    alert(`Message Sent Successfully!\nThank you, ${formData.name}`);
    setFormData({ name: "", email: "", subject: "", message: "" }); // Clear the form
  };

  return (
    <div className="background-contact-us">
      <div className="contact-us-container">
        <div className="contact-us-header">Contact Us</div>

        <form className="contact-us-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Your Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Enter the subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Your Message:</label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your message here"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>

        <div className="contact-us-info">
          <p>For more information, feel free to reach us at:</p>
          <p>
            Email:{" "}
            <a href="mailto:websupport@bookepedia.com">
              websupport@bookepedia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
