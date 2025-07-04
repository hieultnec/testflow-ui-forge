
import React, { useState } from 'react';
import { ArrowLeft, Settings, Download, Plus, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TestScenariosTab from '@/components/project-detail/TestScenariosTab';
import TestCasesTab from '@/components/project-detail/TestCasesTab';
import TestDataTab from '@/components/project-detail/TestDataTab';
import RunHistoryTab from '@/components/project-detail/RunHistoryTab';
import PromptModal from '@/components/project-detail/PromptModal';
import DocumentUploadModal from '@/components/project-detail/DocumentUploadModal';

interface Document {
  id: string;
  name: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  type: string;
  size: string;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [promptType, setPromptType] = useState<'scenarios' | 'cases' | 'data'>('scenarios');

  const mockProject = {
    id: id || '1',
    name: 'E-commerce Platform Testing',
    description: 'Comprehensive test suite for the e-commerce platform including user authentication, product catalog, and payment processing.',
    version: 'v2.1.0',
    owner: 'Sarah Chen',
    lastUpdated: '2024-01-15 14:30:22'
  };

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'requirements.pdf',
      version: 'v2.1',
      uploadDate: '2024-01-15 10:30:00',
      uploadedBy: 'Sarah Chen',
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'test-data.csv',
      version: 'v1.3',
      uploadDate: '2024-01-14 16:20:00',
      uploadedBy: 'John Doe',
      type: 'CSV',
      size: '845 KB'
    },
    {
      id: '3',
      name: 'api-spec.docx',
      version: 'v1.0',
      uploadDate: '2024-01-13 09:15:00',
      uploadedBy: 'Alice Smith',
      type: 'DOCX',
      size: '1.2 MB'
    }
  ];

  const openPromptModal = (type: 'scenarios' | 'cases' | 'data') => {
    setPromptType(type);
    setIsPromptModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockProject.name}</h1>
              <p className="text-gray-600 mb-2">{mockProject.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Version: {mockProject.version}</span>
                <span>Owner: {mockProject.owner}</span>
                <span>Updated: {mockProject.lastUpdated}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="px-4 py-2">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="px-4 py-2">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
            <TabsTrigger value="test-data">Test Data</TabsTrigger>
            <TabsTrigger value="run-history">Run History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>
                    Summary of test artifacts and recent activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900">Test Scenarios</h3>
                      <p className="text-2xl font-bold text-blue-700">12</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900">Test Cases</h3>
                      <p className="text-2xl font-bold text-green-700">47</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900">Test Data Sets</h3>
                      <p className="text-2xl font-bold text-purple-700">23</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-900">Test Runs</h3>
                      <p className="text-2xl font-bold text-orange-700">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Documents Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        📎 Uploaded Documents
                      </CardTitle>
                      <CardDescription>
                        Version-controlled project documents and test data files
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsDocumentUploadOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Version
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{doc.type}</Badge>
                            </TableCell>
                            <TableCell>{doc.version}</TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>{doc.uploadedBy}</TableCell>
                            <TableCell>{doc.uploadDate}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios">
            <TestScenariosTab onOpenPromptModal={() => openPromptModal('scenarios')} />
          </TabsContent>

          <TabsContent value="test-cases">
            <TestCasesTab onOpenPromptModal={() => openPromptModal('cases')} />
          </TabsContent>

          <TabsContent value="test-data">
            <TestDataTab onOpenPromptModal={() => openPromptModal('data')} />
          </TabsContent>

          <TabsContent value="run-history">
            <RunHistoryTab onOpenPromptModal={() => openPromptModal('scenarios')} />
          </TabsContent>
        </Tabs>

        <PromptModal
          isOpen={isPromptModalOpen}
          onClose={() => setIsPromptModalOpen(false)}
          type={promptType}
        />

        <DocumentUploadModal
          isOpen={isDocumentUploadOpen}
          onClose={() => setIsDocumentUploadOpen(false)}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
