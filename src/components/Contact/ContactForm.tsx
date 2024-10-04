import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ContactFormProps {
  onContactAdded: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onContactAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/contacts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onContactAdded();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      } else {
        console.error('Error message:', (error as Error).message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
      <button type="submit">Add Contact</button>
    </form>
  );
};

export default ContactForm;
