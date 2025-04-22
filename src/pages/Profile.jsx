import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/Select';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Upload, X } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
    musicPreference: user?.musicPreference || '',
    musicGoals: user?.musicGoals || '',
    avatarUrl: user?.avatar || '',
  });

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarSource, setAvatarSource] = useState('url'); // 'url' or 'file'
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  // Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  
  // Dummy batch data for student
  const [batches, setBatches] = useState([]);
  
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    if (user?.role === 'student') {
      // Mock data for student batches
      setBatches([
        {
          id: 1,
          name: 'Music Theory 2023',
          courseTitle: 'Music Theory Fundamentals',
          startDate: '2023-01-10'
        },
        {
          id: 2,
          name: 'Guitar Beginners',
          courseTitle: 'Electric Guitar Masterclass',
          startDate: '2023-02-15'
        }
      ]);
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If updating avatar URL, update the preview
    if (name === 'avatarUrl' && avatarSource === 'url') {
      setAvatarPreview(value);
    }
  };

  // Handle avatar file upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setAvatarSource('file');
  };

  // Handle avatar source change
  const handleAvatarSourceChange = (e) => {
    const { value } = e.target;
    setAvatarSource(value);
    
    if (value === 'url') {
      setAvatarPreview(formData.avatarUrl);
    } else if (value === 'file' && avatarFile) {
      setAvatarPreview(URL.createObjectURL(avatarFile));
    }
  };

  // Clear avatar
  const handleClearAvatar = () => {
    setAvatarPreview('');
    setAvatarFile(null);
    setFormData(prev => ({
      ...prev,
      avatarUrl: ''
    }));
  };

  const handleMusicPreferenceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      musicPreference: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would:
    // 1. Upload the file to a server if avatarSource is 'file'
    // 2. Get back a URL from the server
    // 3. Update the user profile with that URL
    
    // For demo purposes, we're using the preview URL directly
    const finalAvatarUrl = avatarSource === 'file' ? avatarPreview : formData.avatarUrl;
    
    const updatedData = {
      ...formData,
      avatarUrl: finalAvatarUrl
    };
    
    // In a real app, you would dispatch an action to update the user profile
    console.log('Profile update:', updatedData);
    
    // Show success notification
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Basic validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation must match');
      return;
    }
    
    // In a real app, you would call an API to update the password
    console.log('Password update:', passwordData);
    
    // Reset form and close modal
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsPasswordModalOpen(false);
    
    // Show success notification
    alert('Password updated successfully!');
  };
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="text-center w-full max-w-md">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="Profile" />
                      ) : (
                        <AvatarFallback>{formData.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                      )}
                    </Avatar>
                    {avatarPreview && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleClearAvatar}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-4 items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="avatarSourceUrl" 
                          name="avatarSource" 
                          value="url" 
                          checked={avatarSource === 'url'} 
                          onChange={handleAvatarSourceChange} 
                        />
                        <Label htmlFor="avatarSourceUrl">URL</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="avatarSourceFile" 
                          name="avatarSource" 
                          value="file" 
                          checked={avatarSource === 'file'} 
                          onChange={handleAvatarSourceChange} 
                        />
                        <Label htmlFor="avatarSourceFile">Upload File</Label>
                      </div>
                    </div>

                    {avatarSource === 'url' ? (
                      <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Profile Picture URL</Label>
                        <Input
                          id="avatarUrl"
                          name="avatarUrl"
                          value={formData.avatarUrl}
                          onChange={handleChange}
                          placeholder="Enter image URL"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="avatarFile">Upload Profile Picture</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <Label htmlFor="avatarFile" className="cursor-pointer text-center">
                              <span className="font-medium text-primary">Click to upload</span>
                              <p className="text-xs text-muted-foreground">Up to 2MB. JPG, PNG, GIF</p>
                            </Label>
                            <input 
                              id="avatarFile" 
                              name="avatarFile" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleAvatarUpload} 
                            />
                            {avatarFile && (
                              <p className="text-sm mt-2 text-muted-foreground">
                                Selected: {avatarFile.name} ({Math.round(avatarFile.size / 1024)} KB)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="musicPreference">Music Preference</Label>
                  <Select 
                    name="musicPreference"
                    value={formData.musicPreference} 
                    onValueChange={handleMusicPreferenceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select music preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="folk">Folk</SelectItem>
                      <SelectItem value="hiphop">Hip Hop</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="blues">Blues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="musicGoals">Music Goals</Label>
                  <Input
                    id="musicGoals"
                    name="musicGoals"
                    value={formData.musicGoals}
                    onChange={handleChange}
                    placeholder="Your music goals"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Update Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account Type</Label>
                <p className="capitalize text-sm">{user.role}</p>
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <div>
                  <Badge className={user.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {user.status || 'active'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => setIsPasswordModalOpen(true)}>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Batches</CardTitle>
                <CardDescription>Your current batch enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                {batches.length > 0 ? (
                  <div className="space-y-4">
                    {batches.map(batch => (
                      <div key={batch.id} className="p-3 border rounded-md">
                        <h3 className="font-medium">{batch.name}</h3>
                        <p className="text-sm text-muted-foreground">{batch.courseTitle}</p>
                        <div className="flex justify-between mt-2 text-xs">
                          <span>Started: {new Date(batch.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">You are not enrolled in any batches.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your credentials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 