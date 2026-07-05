import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../api/admin.api';
import { DataTable } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  displayName?: string;
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  const handleAddNew = () => {
    toast.info('To create a new user, please use the Register page.');
  };

  const handleEdit = async (item: User) => {
    const role = window.prompt(`Edit role for ${item.email} (User or Admin):`, item.role || 'User');
    if (!role) return;
    if (role !== 'User' && role !== 'Admin') {
      toast.error('Role must be either User or Admin');
      return;
    }
    
    try {
      await adminApi.updateUser(item._id, { role });
      toast.success('User updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteRequest = (item: User) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteUser(itemToDelete._id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'email', header: 'Email' },
    { key: 'displayName', header: 'Display Name', render: (item: User) => item.displayName || '-' },
    { 
      key: 'role', 
      header: 'Role',
      render: (item: User) => (
        <span className={`px-2 py-1 text-xs font-bold font-mono tracking-wide rounded-[2px] ${item.role === 'Admin' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          {item.role || 'User'}
        </span>
      )
    },
    { 
      key: 'isEmailVerified', 
      header: 'Verified',
      render: (item: User) => (
        <span className={`px-2 py-1 text-xs font-bold font-mono tracking-wide rounded-[2px] border ${item.isEmailVerified ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950' : 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950'}`}>
          {item.isEmailVerified ? 'YES' : 'NO'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono uppercase tracking-wider text-foreground">Users Management</h1>
        <p className="text-sm font-mono text-muted-foreground mt-1">Manage user accounts and roles.</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search users by email or name..."
        onAddNew={handleAddNew}
        addButtonLabel="New User (Info)"
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete the user "${itemToDelete?.email}"? All their progress will be lost forever.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
