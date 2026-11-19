import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/spinner';
import { getAllUsers, updateUserRole, deleteUser } from '@/services/userService';
import { toast } from 'sonner';
import { Users, Trash2 } from 'lucide-react';

const ROLE_OPTIONS = ['ADMIN', 'INVESTIGATOR', 'FORENSIC_ANALYST', 'PROSECUTOR'];

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(true);
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <PageLoader message="Loading users..." />;

  return (
    <AppLayout title="User Management" subtitle="Manage system users and roles">
      <Card className="animate-slide-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" /> System Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted text-sm">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border border-border bg-sidebar/50 gap-4">
                  <div>
                    <p className="font-medium text-foreground">{user.fullName}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                    <Badge variant="outline" className="mt-2">{user.role}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select defaultValue={user.role} onValueChange={(val) => handleRoleChange(user.id, val)} disabled={updating}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-danger hover:text-danger hover:bg-danger/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
