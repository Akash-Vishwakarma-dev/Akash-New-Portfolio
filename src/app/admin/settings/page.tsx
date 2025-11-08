"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { toast } from "sonner";
import { Save, RefreshCw, Database, Mail, Cloud, Shield } from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // General Settings
  const [siteName, setSiteName] = useState("My Portfolio");
  const [siteDescription, setSiteDescription] = useState("Full-stack developer portfolio");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Email Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contactFormEmail, setContactFormEmail] = useState("admin@example.com");

  // Database Settings
  const [dbBackupEnabled, setDbBackupEnabled] = useState(true);
  const [dbBackupFrequency, setDbBackupFrequency] = useState("daily");

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const handleClearCache = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Cache cleared successfully!");
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading && !isSaving) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LottieLoader size={100} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your portfolio configuration</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="My Portfolio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Full-stack developer portfolio"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              <Separator />
              <div>
                <Button variant="outline" onClick={handleClearCache}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>Configure email notifications and contact form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new messages
                  </p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Form Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactFormEmail}
                  onChange={(e) => setContactFormEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Messages from the contact form will be sent to this email
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Settings
              </CardTitle>
              <CardDescription>Configure database backups and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dbBackup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic database backups
                  </p>
                </div>
                <Switch
                  id="dbBackup"
                  checked={dbBackupEnabled}
                  onCheckedChange={setDbBackupEnabled}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="backupFreq">Backup Frequency</Label>
                <Input
                  id="backupFreq"
                  value={dbBackupFrequency}
                  onChange={(e) => setDbBackupFrequency(e.target.value)}
                  placeholder="daily"
                  disabled={!dbBackupEnabled}
                />
                <p className="text-sm text-muted-foreground">
                  How often to create database backups (daily, weekly, monthly)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin login
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  placeholder="30"
                />
                <p className="text-sm text-muted-foreground">
                  Auto-logout after this many minutes of inactivity
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
