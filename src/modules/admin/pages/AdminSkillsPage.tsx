import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../api/admin.api';
import { DataTable } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { toast } from 'sonner';

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export const AdminSkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.getSkills();
      setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [skills, searchQuery]);

  const handleAddNew = async () => {
    const name = window.prompt('Enter skill name:');
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const description = window.prompt('Enter skill description (optional):');
    
    try {
      await adminApi.createSkill({ name, slug, description: description || '' });
      toast.success('Skill created successfully');
      fetchSkills();
    } catch (error) {
      toast.error('Failed to create skill');
    }
  };

  const handleEdit = async (item: Skill) => {
    const name = window.prompt('Edit skill name:', item.name);
    if (!name) return;
    const description = window.prompt('Edit skill description:', item.description || '');
    
    try {
      await adminApi.updateSkill(item._id, { name, description });
      toast.success('Skill updated successfully');
      fetchSkills();
    } catch (error) {
      toast.error('Failed to update skill');
    }
  };

  const handleDeleteRequest = (item: Skill) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteSkill(itemToDelete._id);
      toast.success('Skill deleted successfully');
      fetchSkills();
    } catch (error) {
      toast.error('Failed to delete skill');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { 
      key: 'description', 
      header: 'Description',
      render: (item: Skill) => (
        <span className="truncate max-w-xs block" title={item.description || ''}>
          {item.description || '-'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono uppercase tracking-wider text-foreground">Skills Management</h1>
        <p className="text-sm font-mono text-muted-foreground mt-1">Manage learning skills and their descriptions.</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredSkills}
        keyExtractor={(item) => item._id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search skills by name or slug..."
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Skill"
        description={`Are you sure you want to delete the skill "${itemToDelete?.name}"?`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
