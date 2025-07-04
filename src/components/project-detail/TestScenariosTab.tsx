
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

interface TestCase {
  id: string;
  name: string;
  expectedResult: string;
  steps: string[];
  tags: string[];
  version: string;
  lastUpdated: string;
  testDataSets: TestDataSet[];
}

interface TestDataSet {
  id: string;
  name: string;
  inputData: Record<string, any>;
  expectedOutput: Record<string, any>;
  version: string;
  lastUpdated: string;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  version: string;
  priority: 'High' | 'Medium' | 'Low';
  testCases: TestCase[];
}

const mockScenarios: TestScenario[] = [
  {
    id: '1',
    name: 'User Registration Flow',
    description: 'Complete user registration process including email verification',
    lastUpdated: '2024-01-15',
    version: 'v1.2',
    priority: 'High',
    testCases: [
      {
        id: '1',
        name: 'Register with valid email',
        expectedResult: 'User successfully registered and verification email sent',
        steps: [
          'Navigate to registration page',
          'Enter valid email address',
          'Enter strong password',
          'Confirm password',
          'Click Register button'
        ],
        tags: ['Regression', 'Smoke'],
        version: 'v1.2',
        lastUpdated: '2024-01-15',
        testDataSets: [
          {
            id: '1',
            name: 'Valid User Data',
            inputData: { email: 'test@example.com', password: 'SecurePass123!' },
            expectedOutput: { status: 'success', message: 'Registration successful' },
            version: 'v1.0',
            lastUpdated: '2024-01-15'
          }
        ]
      },
      {
        id: '2',
        name: 'Register with invalid email',
        expectedResult: 'Error message displayed for invalid email format',
        steps: [
          'Navigate to registration page',
          'Enter invalid email format',
          'Enter password',
          'Click Register button'
        ],
        tags: ['Negative', 'Validation'],
        version: 'v1.1',
        lastUpdated: '2024-01-14',
        testDataSets: [
          {
            id: '2',
            name: 'Invalid Email Data',
            inputData: { email: 'invalid@', password: 'SecurePass123!' },
            expectedOutput: { status: 'error', message: 'Invalid email format' },
            version: 'v1.0',
            lastUpdated: '2024-01-14'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Payment Processing',
    description: 'Credit card and PayPal payment flows with error handling',
    lastUpdated: '2024-01-14',
    version: 'v1.1',
    priority: 'High',
    testCases: [
      {
        id: '3',
        name: 'Process credit card payment',
        expectedResult: 'Payment processed successfully and confirmation displayed',
        steps: [
          'Add items to cart',
          'Proceed to checkout',
          'Enter valid credit card details',
          'Click Pay Now button',
          'Verify payment confirmation'
        ],
        tags: ['Critical', 'Integration'],
        version: 'v1.0',
        lastUpdated: '2024-01-13',
        testDataSets: [
          {
            id: '3',
            name: 'Valid Credit Card',
            inputData: { cardNumber: '4111111111111111', cvv: '123', expiry: '12/25' },
            expectedOutput: { status: 'success', transactionId: 'TXN123' },
            version: 'v1.0',
            lastUpdated: '2024-01-13'
          }
        ]
      }
    ]
  }
];

const TestScenariosTab: React.FC = () => {
  const [scenarios, setScenarios] = useState<TestScenario[]>(mockScenarios);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);
  const [expandedTestCases, setExpandedTestCases] = useState<string[]>([]);
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

  const toggleTestCase = (testCaseId: string) => {
    setExpandedTestCases(prev =>
      prev.includes(testCaseId)
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
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
  };

  const handleRunTestCase = (testCaseId: string, testCaseName: string) => {
    console.log(`Running test case: ${testCaseName} (ID: ${testCaseId})`);
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

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Regression': 'bg-blue-50 text-blue-700 border-blue-200',
      'Smoke': 'bg-green-50 text-green-700 border-green-200',
      'Critical': 'bg-red-50 text-red-700 border-red-200',
      'Negative': 'bg-orange-50 text-orange-700 border-orange-200',
      'Validation': 'bg-purple-50 text-purple-700 border-purple-200',
      'Integration': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[tag] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Test Scenarios & Cases</CardTitle>
            <div className="flex gap-2">
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
                          <span className="text-xs text-gray-500">{scenario.testCases.length} test cases</span>
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
                  <div className="mt-2 ml-6 space-y-2">
                    {/* Scenario Actions */}
                    <div className="p-3 bg-white border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 text-sm">Scenario Actions</h5>
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
                        <Button variant="outline" size="sm" onClick={() => handleEditScenario(scenario)} className="px-3 py-1">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit Scenario
                        </Button>
                        <Button variant="outline" size="sm" className="px-3 py-1">
                          <History className="w-4 h-4 mr-1" />
                          Version History
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

                    {/* Test Cases */}
                    <div className="space-y-2">
                      <h6 className="font-medium text-gray-900 text-sm px-3">Test Cases ({scenario.testCases.length})</h6>
                      {scenario.testCases.map((testCase) => (
                        <Collapsible
                          key={testCase.id}
                          open={expandedTestCases.includes(testCase.id)}
                          onOpenChange={() => toggleTestCase(testCase.id)}
                        >
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors border border-blue-200">
                              <div className="flex items-center gap-3">
                                {expandedTestCases.includes(testCase.id) ? (
                                  <ChevronDown className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-blue-600" />
                                )}
                                <div className="text-left">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-blue-900 text-sm">{testCase.name}</h5>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-1 h-6 w-6"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRunTestCase(testCase.id, testCase.name);
                                          }}
                                        >
                                          <Play className="w-3 h-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Run this test case</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="flex items-center gap-1 mb-2 flex-wrap">
                                    {testCase.tags.map((tag) => (
                                      <Badge key={tag} className={`${getTagColor(tag)} text-xs px-2 py-0`} variant="outline">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-blue-600">Version: {testCase.version}</span>
                                    <span className="text-xs text-blue-400">•</span>
                                    <span className="text-xs text-blue-600">Updated: {testCase.lastUpdated}</span>
                                    <span className="text-xs text-blue-400">•</span>
                                    <span className="text-xs text-blue-600">{testCase.testDataSets.length} data sets</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="mt-2 ml-6 p-3 bg-white border border-blue-200 rounded-md">
                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 text-sm">Steps:</h6>
                                  <ol className="space-y-1">
                                    {testCase.steps.map((step, index) => (
                                      <li key={index} className="flex items-start text-xs text-gray-700">
                                        <span className="mr-2 text-blue-600 font-medium">{index + 1}.</span>
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 text-sm">Expected Result:</h6>
                                  <p className="text-xs text-gray-700">{testCase.expectedResult}</p>
                                </div>
                                
                                {/* Test Data Sets */}
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 text-sm">Test Data Sets ({testCase.testDataSets.length})</h6>
                                  <div className="space-y-2">
                                    {testCase.testDataSets.map((dataSet) => (
                                      <div key={dataSet.id} className="p-2 bg-gray-50 rounded border">
                                        <div className="flex items-center justify-between mb-2">
                                          <h7 className="font-medium text-gray-800 text-xs">{dataSet.name}</h7>
                                          <span className="text-xs text-gray-500">{dataSet.version}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div>
                                            <span className="font-medium text-gray-700">Input:</span>
                                            <pre className="text-gray-600 bg-white p-1 rounded text-xs overflow-x-auto">
                                              {JSON.stringify(dataSet.inputData, null, 2)}
                                            </pre>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700">Expected Output:</span>
                                            <pre className="text-gray-600 bg-white p-1 rounded text-xs overflow-x-auto">
                                              {JSON.stringify(dataSet.expectedOutput, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-2 border-t border-gray-100 flex-wrap">
                                  <Button variant="outline" size="sm" className="px-3 py-1">
                                    <Edit3 className="w-4 h-4 mr-1" />
                                    Edit Test Case
                                  </Button>
                                  <Button variant="outline" size="sm" className="px-3 py-1">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Test Data
                                  </Button>
                                  <Button variant="outline" size="sm" className="px-3 py-1">
                                    <History className="w-4 h-4 mr-1" />
                                    History
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
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
