
import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for processing`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOCX, TXT, or CSV files only",
          variant: "destructive"
        });
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.owner || !uploadedFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload a document",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate API call to Dify workflow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Project created successfully",
      description: "Your document is being processed by Dify workflow",
    });
    
    // Navigate to workflow result page
    navigate('/project/new/workflow');
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('text')) return '📄';
    if (file.type.includes('csv')) return '📊';
    return '📄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600">Set up a new test project and upload your requirements document</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">Project Details</CardTitle>
              <CardDescription>
                Provide basic information about your test project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Project Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    className="w-full py-3 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what this project will test"
                    className="w-full min-h-[100px] border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    rows={4}
                  />
                </div>

                {/* Owner */}
                <div className="space-y-2">
                  <Label htmlFor="owner" className="text-sm font-medium text-gray-700">
                    Project Owner *
                  </Label>
                  <Input
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    placeholder="Enter owner name"
                    className="w-full py-3 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Document *
                  </Label>
                  
                  {!uploadedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="mb-4">
                        <p className="text-lg font-medium text-gray-700">Drop your file here</p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.docx,.txt,.csv"
                        className="hidden"
                        id="fileUpload"
                      />
                      <Label htmlFor="fileUpload" className="cursor-pointer">
                        <Button type="button" variant="outline" className="hover:bg-blue-50">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </Label>
                      <p className="text-xs text-gray-400 mt-2">
                        Supports: PDF, DOCX, TXT, CSV (Max 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {getFileIcon(uploadedFile)} {uploadedFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing with Dify...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Create Project & Process Document
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
