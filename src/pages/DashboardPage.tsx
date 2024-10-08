import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactForm from '../components/Contact/ContactForm';
import ContactList from '../components/Contact/ContactList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faAddressBook } from '@fortawesome/free-solid-svg-icons'; // Import icons
import './index.css'; // Add a separate CSS file for better styling

// Define the interface for Contact
interface IContact {
  _id: string; // Changed _id to match common MongoDB practice
  name: string;
  email: string;
  phone: string;
}

// Dropdown component for actions
const ActionDropdown: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="action-dropdown">
      <button onClick={toggleDropdown}>Actions</button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [activePage, setActivePage] = useState<'dashboard' | 'contacts'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [editContact, setEditContact] = useState<IContact | null>(null);

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

      setContacts(response.data); // Assuming the API returns an array of contacts
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Function to delete a contact
  const deleteContact = async (contactId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this contact?');
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`http://localhost:5000/api/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Function to update a contact
  const updateContact = async (updatedContact: IContact) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.put(`http://localhost:5000/api/contacts/${updatedContact._id}`, updatedContact, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchContacts();
      setEditContact(null); // Close the edit form
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Use useEffect to fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div
          className="collapse-toggle-icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? '▶' : '◀'}
        </div>
        <ul className="sidebar-list">
          <li>
            <button onClick={() => setActivePage('dashboard')}>
              <FontAwesomeIcon icon={faTachometerAlt} /> {/* Dashboard icon */}
              {!isSidebarCollapsed && ' Dashboard'}
            </button>
          </li>
          <li>
            <button onClick={() => setActivePage('contacts')}>
              <FontAwesomeIcon icon={faAddressBook} /> {/* Contacts icon */}
              {!isSidebarCollapsed && ' Contacts'}
            </button>
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePage === 'dashboard' && (
          <>
            <h1>Dashboard</h1>
            {/* Display contacts in a table format */}
            <table className="contact-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>
                      <ActionDropdown
                        onEdit={() => setEditContact(contact)}
                        onDelete={() => deleteContact(contact._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Edit Contact Form */}
            {editContact && (
              <div className="edit-contact-form">
                <h2>Edit Contact</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editContact) {
                      updateContact(editContact);
                    }
                  }}
                >
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={editContact.name}
                      onChange={(e) =>
                        setEditContact({ ...editContact, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editContact.email}
                      onChange={(e) =>
                        setEditContact({ ...editContact, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Phone:</label>
                    <input
                      type="text"
                      value={editContact.phone}
                      onChange={(e) =>
                        setEditContact({ ...editContact, phone: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setEditContact(null)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </>
        )}
        {activePage === 'contacts' && (
          <>
            <h1>Contacts</h1>
            <ContactForm onContactAdded={fetchContacts} />
            <ContactList contacts={contacts} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
