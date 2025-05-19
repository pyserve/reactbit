"use client";

import Header from "@/components/nav-header";
import AccountSettings from "@/components/settings-accounts";
import AppearanceSettings from "@/components/settings-appearance";
import NotificationSettings from "@/components/settings-notifications";
import SecuritySettings from "@/components/settings-security";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, CogIcon, Moon, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => setFormSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [formSubmitted]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />

      <div className="max-w-[96%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            {formSubmitted && (
              <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your settings have been saved successfully.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="account">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 shrink-0">
                  <div className="md:w-64 shrink-0">
                    <h1 className="text-2xl font-bold mb-6 flex gap-2 items-center">
                      <CogIcon />
                      Settings
                    </h1>
                  </div>
                  <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1">
                    <TabsTrigger
                      value="account"
                      className="justify-start w-full px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <User className="h-4 w-4" />
                      Account & Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="justify-start w-full px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="appearance"
                      className="justify-start w-full px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Moon className="h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="justify-start w-full px-3 py-2 h-auto data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-900 rounded-md"
                    >
                      <Shield className="h-4 w-4" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1">
                  <AccountSettings setFormSubmitted={setFormSubmitted} />
                  <NotificationSettings setFormSubmitted={setFormSubmitted} />
                  <AppearanceSettings setFormSubmitted={setFormSubmitted} />
                  <SecuritySettings setFormSubmitted={setFormSubmitted} />
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
