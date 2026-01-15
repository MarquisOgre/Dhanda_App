import { useState, useEffect } from "react";
import { 
  UserPlus, 
  Trash2, 
  Loader2, 
  Check,
  Shield,
  Users,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { checkMaxUsers } from "@/hooks/useSessionTracking";
import { Badge } from "@/components/ui/badge";

type AppRole = 'admin' | 'supervisor' | 'viewer';

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
}

export function UserManagement() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("viewer");
  const [addingUser, setAddingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name');

      if (profilesError) throw profilesError;

      const usersWithRoles: UserWithRole[] = rolesData
        .map(roleItem => {
          const profile = profilesData.find(p => p.user_id === roleItem.user_id);
          return {
            user_id: roleItem.user_id,
            email: profile?.email || 'Unknown',
            full_name: profile?.full_name || null,
            role: roleItem.role as AppRole
          };
        })
        // Hide superadmin from user list
        .filter(u => u.email !== 'marquisogre@gmail.com');

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !newUserPassword.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setAddingUser(true);
    try {
      // Check max users limit before adding
      const { allowed, error: limitError } = await checkMaxUsers();
      if (!allowed) {
        toast.error(limitError || 'User limit reached');
        setAddingUser(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail.trim(),
        password: newUserPassword,
        options: {
          data: {
            full_name: newUserName.trim() || null,
          },
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update the role if not viewer (viewer is default)
        if (newUserRole !== 'viewer') {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: newUserRole })
            .eq('user_id', data.user.id);

          if (roleError) {
            console.error('Error updating role:', roleError);
          }
        }
      }

      toast.success(`User ${newUserEmail} added successfully`);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      setNewUserRole("viewer");
      setAddUserDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered');
      } else {
        toast.error('Failed to add user: ' + error.message);
      }
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    setDeletingUserId(userId);
    try {
      // Delete user role first
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user: ' + error.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast.error('Failed to update role');
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'supervisor':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'supervisor':
        return <Users className="w-3 h-3" />;
      case 'viewer':
        return <Eye className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="metric-card">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Admin Access Required</h3>
          <p className="text-muted-foreground">
            Only administrators can manage users and change roles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User List */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Add users and manage their access levels
            </p>
          </div>
          <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with specific access level.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserName">Full Name</Label>
                  <Input
                    id="newUserName"
                    placeholder="John Doe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserEmail">Email Address</Label>
                  <Input
                    id="newUserEmail"
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserPassword">Password</Label>
                  <Input
                    id="newUserPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as AppRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Admin - Full access
                        </div>
                      </SelectItem>
                      <SelectItem value="supervisor">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Supervisor - Create & edit
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Viewer - Read only
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={addingUser}>
                  {addingUser ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground">
              Add your first user by clicking the button above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.user_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {u.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{u.full_name || u.email}</p>
                      {u.user_id === user?.id && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {u.user_id !== user?.id ? (
                    <>
                      <Select
                        value={u.role}
                        onValueChange={(v) => handleChangeRole(u.user_id, v as AppRole)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="w-3 h-3" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="supervisor">
                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3" />
                              Supervisor
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              Viewer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {u.email}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(u.user_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingUserId === u.user_id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <Badge variant={getRoleBadgeVariant(u.role)} className="gap-1">
                      {getRoleIcon(u.role)}
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Access Levels Reference */}
      <div className="metric-card">
        <h3 className="font-semibold mb-4">Access Levels Reference</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Supervisor
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  Viewer
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>View Dashboard & Reports</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Create/Edit Invoices</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Manage Items & Parties</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Record Payments</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Manage Settings</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Manage Users</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Delete Data</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Backup & Utilities</TableCell>
              <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
              <TableCell className="text-center text-muted-foreground">—</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
