import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState({
    siteName: 'JamClef Music Learning',
    siteDescription: 'Music education platform for students of all levels',
    supportEmail: 'support@jamclef.com',
    adminEmail: 'admin@jamclef.com',
    allowRegistration: true,
    enforceEmailVerification: true,
    sessionTimeout: 60,
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would dispatch an action to update settings
    console.log('Settings update:', formData);
    // Show success notification
    alert('Settings updated successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <nav className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${activeSection === 'general' ? 'bg-accent font-medium' : ''}`}
                onClick={() => setActiveSection('general')}
              >
                General
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${activeSection === 'appearance' ? 'bg-accent font-medium' : ''}`}
                onClick={() => setActiveSection('appearance')}
              >
                Appearance
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${activeSection === 'security' ? 'bg-accent font-medium' : ''}`}
                onClick={() => setActiveSection('security')}
              >
                Security
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${activeSection === 'emails' ? 'bg-accent font-medium' : ''}`}
                onClick={() => setActiveSection('emails')}
              >
                Email Settings
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${activeSection === 'integrations' ? 'bg-accent font-medium' : ''}`}
                onClick={() => setActiveSection('integrations')}
              >
                Integrations
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${activeSection === 'backups' ? 'bg-accent font-medium' : ''}`}
                onClick={() => setActiveSection('backups')}
              >
                Backups
              </button>
            </nav>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          {activeSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      name="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      name="supportEmail"
                      type="email"
                      value={formData.supportEmail}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <input
                      type="checkbox"
                      id="allowRegistration"
                      name="allowRegistration"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={formData.allowRegistration}
                      onChange={handleChange}
                    />
                    <Label htmlFor="allowRegistration">Allow user registration</Label>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Theme</h3>
                  <p className="text-sm text-muted-foreground mb-4">Select a theme for the platform</p>
                  <ThemeSwitcher />
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Logo</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload your platform logo</p>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">Logo</div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options for the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      name="sessionTimeout"
                      type="number"
                      value={formData.sessionTimeout}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enforceEmailVerification"
                      name="enforceEmailVerification"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={formData.enforceEmailVerification}
                      onChange={handleChange}
                    />
                    <Label htmlFor="enforceEmailVerification">Enforce email verification</Label>
                  </div>
                  
                  <div className="pt-6">
                    <Button variant="outline" className="w-full">Reset All User Passwords</Button>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {(activeSection === 'emails' || activeSection === 'integrations' || activeSection === 'backups') && (
            <Card>
              <CardHeader>
                <CardTitle>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings</CardTitle>
                <CardDescription>This section is under development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground">Additional settings will be available soon</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 