
import React, { useState } from 'react';
import { Plus, Edit3, History, RefreshCw, Eye, ChevronDown, ChevronRight, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ScenarioFormModal from './ScenarioFormModal';
import TestCaseFormModal from './TestCaseFormModal';

interface TestScenario {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  version: string;
  testCasesCount: number;
  priority: 'High' | 'Medium' | 'Low';
}

interface TestScenariosTabProps {
  onOpenPromptModal: () => void;
}

const mockScenarios: TestScenario[] = [
  {
    id: '1',
    name: 'User Registration Flow',
    description: 'Complete user registration process including email verification',
    lastUpdated: '2024-01-15',
    version: 'v1.2',
    testCasesCount: 8,
    priority: 'High'
  },
  {
    id: '2',
    name: 'Payment Processing',
    description: 'Credit card and PayPal payment flows with error handling',
    lastUpdated: '2024-01-14',
    version: 'v1.1',
    testCasesCount: 12,
    priority: 'High'
  },
  {
    id: '3',
    name: 'Product Search',
    description: 'Search functionality with filters and sorting options',
    lastUpdated: '2024-01-13',
    version: 'v1.0',
    testCasesCount: 6,
    priority: 'Medium'
  }
];

const TestScenariosTab: React.FC<TestScenariosTabProps> = ({ onOpenPromptModal }) => {
  const [scenarios, setScenarios] = useState<TestScenario[]>(mockScenarios);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<TestScenario | undefined>();
  const [selectedScenarioForTestCase, setSelectedScenarioForTestCase] = useState<string | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const toggleScenario = (scenarioId: string) => {
    setExpandedScenarios(prev =>
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const handleCreateScenario = () => {
    setModalMode('create');
    setEditingScenario(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditScenario = (scenario: TestScenario) => {
    setModalMode('edit');
    setEditingScenario(scenario);
    setIsFormModalOpen(true);
  };

  const handleAddTestCase = (scenarioId: string) => {
    setSelectedScenarioForTestCase(scenarioId);
    setIsTestCaseModalOpen(true);
  };

  const handleRunScenario = (scenarioId: string, scenarioName: string) => {
    console.log(`Running scenario: ${scenarioName} (ID: ${scenarioId})`);
    // Mock scenario run - in real implementation, this would trigger test execution
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Test Scenarios</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onOpenPromptModal} className="px-3 py-1">
                <RefreshCw className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
              <Button size="sm" onClick={handleCreateScenario} className="px-3 py-1">
                <Plus className="w-4 h-4 mr-1" />
                Add Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <Collapsible
                key={scenario.id}
                open={expandedScenarios.includes(scenario.id)}
                onOpenChange={() => toggleScenario(scenario.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-center gap-3">
                      {expandedScenarios.includes(scenario.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">{scenario.name}</h4>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRunScenario(scenario.id, scenario.name);
                                }}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Run this scenario</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Version: {scenario.version}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">Updated: {scenario.lastUpdated}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{scenario.testCasesCount} test cases</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPriorityColor(scenario.priority)} text-xs px-2 py-0`} variant="outline">
                        {scenario.priority}
                      </Badge>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 ml-6 p-3 bg-white border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 text-sm">Actions</h5>
                      <Button
                        size="sm"
                        onClick={() => handleAddTestCase(scenario.id)}
                        className="px-3 py-1"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Test Case
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" className="px-3 py-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View Test Cases
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditScenario(scenario)} className="px-3 py-1">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit Scenario
                      </Button>
                      <Button variant="outline" size="sm" className="px-3 py-1">
                        <History className="w-4 h-4 mr-1" />
                        Version History
                      </Button>
                      <Button variant="outline" size="sm" onClick={onOpenPromptModal} className="px-3 py-1">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 px-3 py-1">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg">Delete Test Scenario</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              Are you sure you want to delete "{scenario.name}"? This action cannot be undone and will also delete all associated test cases.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteScenario(scenario.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2">
                              Delete Scenario
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      <ScenarioFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        scenario={editingScenario}
        mode={modalMode}
      />

      <TestCaseFormModal
        isOpen={isTestCaseModalOpen}
        onClose={() => setIsTestCaseModalOpen(false)}
        mode="create"
        prefilledScenarioId={selectedScenarioForTestCase}
      />
    </TooltipProvider>
  );
};

export default TestScenariosTab;
