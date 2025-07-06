import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Download, Plus, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TestScenariosTab from '@/components/project-detail/TestScenariosTab';
import DocumentUploadModal from '@/components/project-detail/DocumentUploadModal';
import ScenarioFormModal from '@/components/project-detail/ScenarioFormModal';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchProject } from '@/store/slices/projectSlice';
import { fetchScenarios } from '@/store/slices/scenarioSlice';

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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProject, loading: projectLoading, error: projectError } = useAppSelector(state => state.projects);
  const { scenarios, loading: scenariosLoading } = useAppSelector(state => state.scenarios);
  
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [isScenarioFormOpen, setIsScenarioFormOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
      dispatch(fetchScenarios(id));
    }
  }, [dispatch, id]);

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

  const handleWorkflowClick = () => {
    navigate(`/project/${id}/workflow`);
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading project: {projectError}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const totalTestCases = scenarios.reduce((total, scenario) => 
    total + (scenario.test_cases?.length || 0), 0
  );

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentProject.name}</h1>
              <p className="text-gray-600 mb-1 text-sm">{currentProject.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>Version: {currentProject.version}</span>
                <span>Owner: {currentProject.owner}</span>
                <span>Updated: {new Date(currentProject.lastUpdated).toLocaleString()}</span>
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

        {/* Horizontal Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground mb-4 overflow-x-auto">
            <TabsTrigger value="overview" className="text-sm px-4 py-2">Overview</TabsTrigger>
            <TabsTrigger value="scenarios" className="text-sm px-4 py-2">Test Scenarios</TabsTrigger>
            <TabsTrigger 
              value="workflow" 
              className="text-sm px-4 py-2"
              onClick={handleWorkflowClick}
            >
              Workflow
            </TabsTrigger>
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
                      <p className="text-xl font-bold text-blue-700">{scenarios.length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md border border-gray-100">
                      <h3 className="font-medium text-green-900 text-sm">Test Cases</h3>
                      <p className="text-xl font-bold text-green-700">{totalTestCases}</p>
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
            <TestScenariosTab />
          </TabsContent>
        </Tabs>

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
