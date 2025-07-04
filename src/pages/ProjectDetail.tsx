
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
import ScenarioFormModal from '@/components/project-detail/ScenarioFormModal';

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
  const [isScenarioFormOpen, setIsScenarioFormOpen] = useState(false);
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
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-3">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{mockProject.name}</h1>
              <p className="text-gray-600 mb-1 text-sm">{mockProject.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>Version: {mockProject.version}</span>
                <span>Owner: {mockProject.owner}</span>
                <span>Updated: {mockProject.lastUpdated}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="px-3 py-1">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="px-3 py-1">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="scenarios" className="text-sm">Scenarios</TabsTrigger>
            <TabsTrigger value="test-cases" className="text-sm">Test Cases</TabsTrigger>
            <TabsTrigger value="test-data" className="text-sm">Test Data</TabsTrigger>
            <TabsTrigger value="run-history" className="text-sm">Run History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Project Overview</CardTitle>
                  <CardDescription className="text-sm">
                    Summary of test artifacts and recent activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 p-3 rounded-md border border-gray-100">
                      <h3 className="font-medium text-blue-900 text-sm">Test Scenarios</h3>
                      <p className="text-xl font-bold text-blue-700">12</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md border border-gray-100">
                      <h3 className="font-medium text-green-900 text-sm">Test Cases</h3>
                      <p className="text-xl font-bold text-green-700">47</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-md border border-gray-100">
                      <h3 className="font-medium text-purple-900 text-sm">Test Data Sets</h3>
                      <p className="text-xl font-bold text-purple-700">23</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-md border border-gray-100">
                      <h3 className="font-medium text-orange-900 text-sm">Test Runs</h3>
                      <p className="text-xl font-bold text-orange-700">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Documents Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-4 h-4" />
                        📎 Uploaded Documents
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Version-controlled project documents and test data files
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setIsScenarioFormOpen(true)} className="px-3 py-1">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Scenario
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsDocumentUploadOpen(true)} className="px-3 py-1">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload New Version
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-md border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="py-2 text-xs">Document Name</TableHead>
                          <TableHead className="py-2 text-xs">Type</TableHead>
                          <TableHead className="py-2 text-xs">Version</TableHead>
                          <TableHead className="py-2 text-xs">Size</TableHead>
                          <TableHead className="py-2 text-xs">Uploaded By</TableHead>
                          <TableHead className="py-2 text-xs">Upload Date</TableHead>
                          <TableHead className="py-2 text-xs">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockDocuments.map((doc) => (
                          <TableRow key={doc.id} className="border-gray-100 hover:bg-gray-50">
                            <TableCell className="font-medium py-2 text-sm">{doc.name}</TableCell>
                            <TableCell className="py-2">
                              <Badge variant="secondary" className="text-xs px-2 py-0">{doc.type}</Badge>
                            </TableCell>
                            <TableCell className="py-2 text-sm text-gray-600">{doc.version}</TableCell>
                            <TableCell className="py-2 text-sm text-gray-600">{doc.size}</TableCell>
                            <TableCell className="py-2 text-sm text-gray-600">{doc.uploadedBy}</TableCell>
                            <TableCell className="py-2 text-sm text-gray-600">{doc.uploadDate}</TableCell>
                            <TableCell className="py-2">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="p-1">
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="p-1">
                                  <FileText className="w-3 h-3" />
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

        <ScenarioFormModal
          isOpen={isScenarioFormOpen}
          onClose={() => setIsScenarioFormOpen(false)}
          mode="create"
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
