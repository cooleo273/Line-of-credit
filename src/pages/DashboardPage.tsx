import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactForm from '../components/Contact/ContactForm';
import ContactList from '../components/Contact/ContactList';

// Define the interface for Contact
interface IContact {
  _id: string;  // Changed _id to match common MongoDB practice
  name: string;
  email: string;
  phone: string;
}

const DashboardPage: React.FC = () => {
  const [contacts, setContacts] = useState<IContact[]>([]); // Use IContact[] for type safety

  // Function to fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.get('http://localhost:5000/api/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the contacts state with the fetched data
      setContacts(response.data); // Assuming the API returns an array of contacts
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Use useEffect to fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Pass the fetchContacts function to ContactForm to update the list after adding a new contact */}
      <ContactForm onContactAdded={fetchContacts} />
      {/* Pass contacts to ContactList to display */}
      <ContactList contacts={contacts} />
    </div>
  );
};

export default DashboardPage;
