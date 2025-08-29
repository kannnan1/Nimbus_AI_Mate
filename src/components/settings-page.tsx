
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings, FolderKanban, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from './ui/avatar';

const teamMembers = [
  { name: "Alex Doe", email: "alex.doe@example.com", role: "Admin" },
  { name: "Jane Smith", email: "jane.smith@example.com", role: "Editor" },
  { name: "Bob Johnson", email: "bob.johnson@example.com", role: "Viewer" },
  { name: "Alice Williams", email: "alice.williams@example.com", role: "Editor" },
];

export function SettingsPage() {
  const [temperature, setTemperature] = useState([50]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/logo.png" alt="Nimbus Uno Application Logo" width={150} height={40} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/knowledge-store">
                  <FolderKanban />
                  Knowledge Store
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <LayoutDashboard />
                  AI Mate
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/settings">
                  <Settings />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-muted/20">
          <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-card">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold">AI Mate</h1>
                <p className="text-xs text-muted-foreground">Your AI-powered collaborative document editor</p>
              </div>
            <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>K</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">User Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your application's configuration and user permissions.</p>
            </header>

            <Tabs defaultValue="vector-db">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vector-db">Vector DB</TabsTrigger>
                <TabsTrigger value="llm-model">LLM Model</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              </TabsList>
              <TabsContent value="vector-db">
                <Card>
                  <CardHeader>
                    <CardTitle>Vector DB Configuration</CardTitle>
                    <CardDescription>
                      Configure the connection to your Pinecone vector database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pinecone-api-key">API Key</Label>
                      <Input id="pinecone-api-key" type="password" placeholder="Enter your Pinecone API key" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pinecone-env">Environment</Label>
                      <Input id="pinecone-env" placeholder="e.g., us-west1-gcp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pinecone-index">Index Name</Label>
                      <Input id="pinecone-index" placeholder="e.g., nimbus-knowledge-base" />
                    </div>
                    <Button>Test Connection</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="llm-model">
                <Card>
                  <CardHeader>
                    <CardTitle>LLM Model Configuration</CardTitle>
                    <CardDescription>
                      Adjust the settings for the generative AI model.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="llm-model">Model</Label>
                      <Select>
                        <SelectTrigger id="llm-model">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="temperature"
                          defaultValue={temperature}
                          onValueChange={setTemperature}
                          max={100}
                          step={1}
                        />
                        <span className="text-sm text-muted-foreground w-12 text-center">
                          {(temperature[0] / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lower values are more deterministic, higher values are more creative.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Output Tokens</Label>
                      <Input id="max-tokens" type="number" defaultValue={2048} />
                    </div>
                     <Button>Save Configuration</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="roles">
                <Card>
                  <CardHeader>
                    <CardTitle>Roles & Permissions</CardTitle>
                    <CardDescription>
                      Manage team member roles and access levels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member) => (
                          <TableRow key={member.email}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                        <DropdownMenuItem>Remove User</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
