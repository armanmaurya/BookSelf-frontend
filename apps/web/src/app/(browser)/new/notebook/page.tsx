"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, FileText, Sparkles } from "lucide-react";

interface NotebookFormData {
  name: string;
  overview: string;
}

export default function CreateNotebookPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<NotebookFormData>({
    name: "",
    overview: "",
  });

  const handleInputChange = (field: keyof NotebookFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Notebook name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.overview.trim()) {
      toast({
        title: "Validation Error", 
        description: "Notebook overview is required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Creating notebook:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "Your notebook has been created successfully.",
      });

      // Redirect to the created notebook or notebooks list
      router.push('/notebooks'); // Adjust route as needed
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Data Science",
    "Machine Learning", 
    "Web Development",
    "Data Analysis",
    "Research",
    "Education",
    "Tutorial",
    "Experiment",
    "Other"
  ];

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Create New Notebook</h1>
          </div>
          <p className="text-muted-foreground">
            Start your journey by creating a new notebook for any purpose.
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notebook Details
            </CardTitle>
            <CardDescription>
              Provide basic information about your notebook to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notebook Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Notebook Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter notebook name (e.g., 'Customer Analysis Dashboard')"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <Label htmlFor="overview">Overview *</Label>
                <Textarea
                  id="overview"
                  placeholder="Describe what this notebook is about, its purpose, and what insights it will provide..."
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  disabled={isLoading}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.overview.length}/500 characters
                </p>
              </div>

              {/* Tags */}
              

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name.trim() || !formData.overview.trim()}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Notebook
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <h4 className="font-medium text-foreground">Tips for creating a great notebook:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Choose a descriptive name that clearly indicates the notebook's purpose</li>
                <li>Write a comprehensive overview explaining the goals and expected outcomes</li>
                <li>Add relevant tags to help others discover your notebook</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
