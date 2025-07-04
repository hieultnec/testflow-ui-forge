
import React, { useState } from 'react';
import { ArrowLeft, Settings, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useParams } from 'react-router-dom';
import TestScenariosTab from '@/components/project-detail/TestScenariosTab';
import TestCasesTab from '@/components/project-detail/TestCasesTab';
import TestDataTab from '@/components/project-detail/TestDataTab';
import RunHistoryTab from '@/components/project-detail/RunHistoryTab';
import PromptModal from '@/components/project-detail/PromptModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptType, setPromptType] = useState<'scenarios' | 'cases' | 'data'>('scenarios');

  const mockProject = {
    id: id || '1',
    name: 'E-commerce Platform Testing',
    description: 'Comprehensive test suite for the e-commerce platform including user authentication, product catalog, and payment processing.',
    version: 'v2.1.0',
    owner: 'Sarah Chen',
    lastUpdated: '2024-01-15 14:30:22'
  };

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
      </div>
    </div>
  );
};

export default ProjectDetail;
