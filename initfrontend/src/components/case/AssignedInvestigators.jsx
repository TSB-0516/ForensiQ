import React, { useState, useEffect } from 'react';
import { getInvestigatorsForCase, assignInvestigatorToCase, unassignInvestigatorFromCase } from '@/services/caseService';
import { getAllUsers } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserMinus, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AssignedInvestigators({ caseId }) {
  const { role } = useAuth();
  const [investigators, setInvestigators] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchInvestigators = async () => {
    try {
      const data = await getInvestigatorsForCase(caseId);
      setInvestigators(data);
    } catch (error) {
      toast.error('Failed to load assigned investigators');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    if (role !== 'ADMIN') return;
    try {
      const users = await getAllUsers();
      // Filter only investigators
      setAllUsers(users.filter(u => u.role === 'INVESTIGATOR'));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvestigators();
    fetchAllUsers();
  }, [caseId, role]);

  const handleAssign = async () => {
    if (!selectedUserId) return;
    setAssigning(true);
    try {
      await assignInvestigatorToCase(caseId, selectedUserId);
      toast.success('Investigator assigned');
      setSelectedUserId('');
      fetchInvestigators();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign investigator');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (invId) => {
    if (!window.confirm('Are you sure you want to remove this investigator from the case?')) return;
    try {
      await unassignInvestigatorFromCase(caseId, invId);
      toast.success('Investigator removed');
      fetchInvestigators();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove investigator');
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading investigators...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-foreground">Assigned Investigators</h3>
      </div>
      
      {investigators.length === 0 ? (
        <p className="text-sm text-muted">No investigators assigned to this case.</p>
      ) : (
        <div className="space-y-2">
          {investigators.map(inv => (
            <div key={inv.id || inv.investigatorId || inv.userId || Math.random()} className="flex items-center justify-between p-3 rounded-sm border border-border bg-sidebar/50">
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  {inv.fullName || inv.investigatorName}
                  <Badge variant="outline" className="text-[10px]">Investigator</Badge>
                </p>
                <p className="text-xs text-muted mt-0.5">{inv.email || inv.investigatorEmail}</p>
              </div>
              {role === 'ADMIN' && (
                <Button variant="ghost" size="sm" onClick={() => handleRemove(inv.investigatorId || inv.userId || inv.id)} className="text-danger hover:text-danger hover:bg-danger/10">
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {role === 'ADMIN' && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
          <div className="flex-1">
            <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={assigning}>
              <SelectTrigger>
                <SelectValue placeholder="Select investigator to assign" />
              </SelectTrigger>
              <SelectContent>
                {allUsers.filter(u => !investigators.some(i => (i.investigatorId || i.userId || i.id) === u.id)).map(u => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.fullName} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} disabled={!selectedUserId || assigning} className="gap-2 shrink-0">
            <UserPlus className="h-4 w-4" /> {assigning ? 'Assigning...' : 'Assign'}
          </Button>
        </div>
      )}
    </div>
  );
}
