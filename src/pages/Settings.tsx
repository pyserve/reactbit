"use client";

import type React from "react";

import Header from "@/components/nav-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Bell,
  Lock,
  Moon,
  Save,
  Shield,
  Sun,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Reset the form submitted state after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {formSubmitted && (
              <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                <Save className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your settings have been saved successfully.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="account">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 shrink-0">
                  <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1">
                    <TabsTrigger
                      value="account"
                      className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="privacy"
                      className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Privacy
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="appearance"
                      className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="justify-start px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1">
                  <TabsContent value="account">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                          Manage your account information and preferences.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  defaultValue="Your Name"
                                  className="border-gray-200 dark:border-gray-800"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  defaultValue="username"
                                  className="border-gray-200 dark:border-gray-800"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                defaultValue="your.email@example.com"
                                className="border-gray-200 dark:border-gray-800"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="Add a phone number"
                                className="border-gray-200 dark:border-gray-800"
                              />
                            </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Account Preferences
                            </h3>

                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select defaultValue="en">
                                <SelectTrigger
                                  id="language"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                  <SelectItem value="ja">Japanese</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="timezone">Timezone</Label>
                              <Select defaultValue="utc-8">
                                <SelectTrigger
                                  id="timezone"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="utc-8">
                                    Pacific Time (UTC-8)
                                  </SelectItem>
                                  <SelectItem value="utc-5">
                                    Eastern Time (UTC-5)
                                  </SelectItem>
                                  <SelectItem value="utc+0">
                                    Greenwich Mean Time (UTC+0)
                                  </SelectItem>
                                  <SelectItem value="utc+1">
                                    Central European Time (UTC+1)
                                  </SelectItem>
                                  <SelectItem value="utc+8">
                                    China Standard Time (UTC+8)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="profile">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your profile information and how others see
                          you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Profile Picture</Label>
                              <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                  <AvatarImage
                                    src="/placeholder.svg?height=80&width=80"
                                    alt="Profile"
                                  />
                                  <AvatarFallback>YN</AvatarFallback>
                                </Avatar>
                                <Button
                                  variant="outline"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Change Photo
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Cover Image</Label>
                              <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
                                <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center mb-4">
                                  <img
                                    src="/placeholder.svg?height=128&width=600"
                                    alt="Cover"
                                    className="h-full w-full object-cover rounded"
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Cover Image
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                placeholder="Tell us about yourself"
                                className="min-h-[100px] border-gray-200 dark:border-gray-800"
                                defaultValue="This is your profile. Add a bio to tell the world about yourself."
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  placeholder="City, Country"
                                  defaultValue="Your Location"
                                  className="border-gray-200 dark:border-gray-800"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                  id="website"
                                  placeholder="https://yourwebsite.com"
                                  defaultValue="yourwebsite.com"
                                  className="border-gray-200 dark:border-gray-800"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="privacy">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                      <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                        <CardDescription>
                          Control who can see your profile and interact with
                          you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  Private Account
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  When enabled, only approved followers can see
                                  your posts
                                </p>
                              </div>
                              <Switch />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  Activity Status
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Show when you're active on the platform
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  Read Receipts
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Let others know when you've read their
                                  messages
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <Label htmlFor="profile-visibility">
                                Profile Visibility
                              </Label>
                              <Select defaultValue="everyone">
                                <SelectTrigger
                                  id="profile-visibility"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <SelectValue placeholder="Who can see your profile" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="everyone">
                                    Everyone
                                  </SelectItem>
                                  <SelectItem value="followers">
                                    Followers Only
                                  </SelectItem>
                                  <SelectItem value="nobody">Nobody</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="message-permissions">
                                Message Permissions
                              </Label>
                              <Select defaultValue="followers">
                                <SelectTrigger
                                  id="message-permissions"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <SelectValue placeholder="Who can message you" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="everyone">
                                    Everyone
                                  </SelectItem>
                                  <SelectItem value="followers">
                                    Followers Only
                                  </SelectItem>
                                  <SelectItem value="nobody">Nobody</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                          Manage how and when you receive notifications.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Email Notifications
                            </h3>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  New Messages
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Receive email notifications for new messages
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  New Followers
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Receive email notifications when someone
                                  follows you
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  Comments on Posts
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Receive email notifications for comments on
                                  your posts
                                </p>
                              </div>
                              <Switch />
                            </div>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-medium">
                              Push Notifications
                            </h3>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  All Notifications
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Enable or disable all push notifications
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  New Messages
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Receive push notifications for new messages
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  New Followers
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Receive push notifications when someone
                                  follows you
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="appearance">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                      <CardHeader>
                        <CardTitle>Appearance Settings</CardTitle>
                        <CardDescription>
                          Customize how the application looks and feels.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Theme</Label>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center space-x-2">
                                  <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 flex items-center justify-center bg-white text-black">
                                    <Sun className="h-6 w-6" />
                                  </div>
                                  <Label htmlFor="theme-light">Light</Label>
                                  <input
                                    type="radio"
                                    id="theme-light"
                                    name="theme"
                                    className="sr-only"
                                  />
                                </div>

                                <div className="flex items-center space-x-2">
                                  <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 flex items-center justify-center bg-black text-white">
                                    <Moon className="h-6 w-6" />
                                  </div>
                                  <Label htmlFor="theme-dark">Dark</Label>
                                  <input
                                    type="radio"
                                    id="theme-dark"
                                    name="theme"
                                    className="sr-only"
                                    defaultChecked
                                  />
                                </div>

                                <div className="flex items-center space-x-2">
                                  <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 flex items-center justify-center bg-gradient-to-r from-white to-black">
                                    <div className="flex">
                                      <Sun className="h-6 w-6 text-black" />
                                      <Moon className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                  <Label htmlFor="theme-system">System</Label>
                                  <input
                                    type="radio"
                                    id="theme-system"
                                    name="theme"
                                    className="sr-only"
                                  />
                                </div>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                              <Label htmlFor="font-size">Font Size</Label>
                              <Select defaultValue="medium">
                                <SelectTrigger
                                  id="font-size"
                                  className="border-gray-200 dark:border-gray-800"
                                >
                                  <SelectValue placeholder="Select font size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  Reduce Motion
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Reduce animations and transitions
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Manage your account security and login options.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Change Password
                            </h3>

                            <div className="space-y-2">
                              <Label htmlFor="current-password">
                                Current Password
                              </Label>
                              <Input
                                id="current-password"
                                type="password"
                                className="border-gray-200 dark:border-gray-800"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input
                                id="new-password"
                                type="password"
                                className="border-gray-200 dark:border-gray-800"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">
                                Confirm New Password
                              </Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                className="border-gray-200 dark:border-gray-800"
                              />
                            </div>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-medium">
                              Two-Factor Authentication
                            </h3>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">Enable 2FA</Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Add an extra layer of security to your account
                                </p>
                              </div>
                              <Switch />
                            </div>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-medium">
                              Session Management
                            </h3>

                            <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Active Sessions</AlertTitle>
                              <AlertDescription>
                                You are currently logged in on 2 devices. You
                                can log out of all other sessions below.
                              </AlertDescription>
                            </Alert>

                            <Button
                              variant="outline"
                              className="border-gray-200 dark:border-gray-800 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Log Out of All Other Sessions
                            </Button>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
