
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload } from "lucide-react";

const ProjectSubmission = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Your Film Project</CardTitle>
        <CardDescription>
          Fill out the form below to submit your film for review and distribution opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Film Title</Label>
              <Input id="title" placeholder="Enter your film's title" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input id="director" placeholder="Director's name" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year">Release Year</Label>
              <Input id="year" placeholder="YYYY" type="number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="runtime">Runtime (minutes)</Label>
              <Input id="runtime" placeholder="e.g., 90" type="number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" placeholder="e.g., Drama, Comedy" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea id="synopsis" placeholder="Briefly describe your film..." className="min-h-[100px]" />
          </div>
          
          <div className="space-y-4">
            <Label>Upload Film Files</Label>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your film file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports MP4, MOV, AVI (max 5GB)
                </p>
                <Input id="filmUpload" type="file" className="hidden" />
                <Button size="sm" variant="outline">Select File</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Upload Cover Art & Promotional Materials</Label>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Upload poster, stills, and promotional images
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPEG, PNG (max 10MB each)
                </p>
                <Input id="promoUpload" type="file" className="hidden" multiple />
                <Button size="sm" variant="outline">Select Images</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea id="additionalInfo" placeholder="Any awards, festival history, or special notes..." className="min-h-[100px]" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Save Draft</Button>
        <Button>Submit Film</Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectSubmission;
