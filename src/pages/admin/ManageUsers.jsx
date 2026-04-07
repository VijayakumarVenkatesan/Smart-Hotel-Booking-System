import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import { FaUsersCog } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="fw-bold mb-4 text-gradient"><FaUsersCog className="me-2"/>User Management</h1>
      
      <Card className="border-0 shadow-sm bg-glass overflow-hidden">
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4 text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-3 px-4 fw-bold">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <Badge bg={u.role === 'Admin' ? 'danger' : u.role === 'Hotel Manager' ? 'primary' : 'secondary'}>
                    {u.role}
                  </Badge>
                </td>
                <td className="py-3 px-4">{u.contactNumber}</td>
                <td className="py-3 px-4 text-end">
                  <Button variant="outline-danger" size="sm" onClick={() => deleteUser(u.id)} disabled={u.role === 'Admin'}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default ManageUsers;
