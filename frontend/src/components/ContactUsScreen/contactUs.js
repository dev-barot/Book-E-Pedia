import React, { useState } from "react";
import { BASE_URL } from "../../utils/config";
import "./contactUs.css"; // Import your CSS file for styling

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/contact-us/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.bool) {
        alert(`Message Sent Successfully!\nThank you, ${formData.name}`);
        setFormData({ name: "", email: "", subject: "", message: "" }); // Clear the form
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="contact-us-info">
          <p>For more information, feel free to reach us at:</p>
          <p>
            Email:{" "}
            <a href="mailto:bookepedia.business@gmail.com">

            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
