import React, { useState } from 'react';
import { ArrowLeft, Edit3, RefreshCw, Save, ChevronDown, ChevronRight, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PromptEditModal from '@/components/PromptEditModal';

interface TestScenario {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Generated' | 'Reviewed';
  description: string;
}

interface TestCase {
  id: string;
  scenarioId: string;
  title: string;
  steps: string[];
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface TestData {
  id: string;
  category: string;
  field: string;
  validValues: string[];
  invalidValues: string[];
}

const mockScenarios: TestScenario[] = [
  {
    id: '1',
    title: 'User Registration Flow',
    priority: 'High',
    status: 'Generated',
    description: 'Test the complete user registration process including validation and confirmation'
  },
  {
    id: '2',
    title: 'Login Authentication',
    priority: 'High',
    status: 'Generated',
    description: 'Verify user login with valid and invalid credentials'
  },
  {
    id: '3',
    title: 'Password Reset Process',
    priority: 'Medium',
    status: 'Generated',
    description: 'Test password reset functionality via email'
  }
];

const mockTestCases: TestCase[] = [
  {
    id: '1',
    scenarioId: '1',
    title: 'Register with valid information',
    steps: [
      'Navigate to registration page',
      'Fill in all required fields with valid data',
      'Click Register button',
      'Check for confirmation email'
    ],
    expectedResult: 'User account created successfully and confirmation email sent',
    priority: 'High'
  },
  {
    id: '2',
    scenarioId: '1',
    title: 'Register with invalid email format',
    steps: [
      'Navigate to registration page',
      'Enter invalid email format',
      'Fill other required fields',
      'Click Register button'
    ],
    expectedResult: 'Error message displayed for invalid email format',
    priority: 'High'
  }
];

const mockTestData: TestData[] = [
  {
    id: '1',
    category: 'User Data',
    field: 'Email',
    validValues: ['user@example.com', 'test.user+tag@domain.co.uk'],
    invalidValues: ['invalid-email', '@domain.com', 'user@']
  },
  {
    id: '2',
    category: 'User Data',
    field: 'Password',
    validValues: ['StrongPass123!', 'MySecure@Pass2024'],
    invalidValues: ['123', 'password', 'ALLCAPS']
  }
];

const WorkflowResult = () => {
  const navigate = useNavigate();
  const [scenarios] = useState<TestScenario[]>(mockScenarios);
  const [testCases] = useState<TestCase[]>(mockTestCases);
  const [testData] = useState<TestData[]>(mockTestData);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>(['1']);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptType, setPromptType] = useState<'scenarios' | 'cases' | 'data'>('scenarios');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const toggleScenario = (scenarioId: string) => {
    setExpandedScenarios(prev =>
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRegenerate = async (type: 'scenarios' | 'cases' | 'data') => {
    setIsRegenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRegenerating(false);
    toast({
      title: "Content regenerated",
      description: `${type} have been updated with new AI-generated content`,
    });
  };

  const handleSaveVersion = () => {
    toast({
      title: "Version saved successfully",
      description: "Your test artifacts have been saved as a new version",
    });
    navigate('/project/new/versions');
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
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Results</h1>
              <p className="text-gray-600">AI-generated test artifacts from your uploaded document</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="px-4 py-2">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSaveVersion} className="bg-green-600 hover:bg-green-700 px-6 py-2">
                <Save className="w-4 h-4 mr-2" />
                Save Version
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Scenarios */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-600" />
                      Test Scenarios
                    </CardTitle>
                    <CardDescription>AI-generated test scenarios from your document</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPromptModal('scenarios')}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit Prompt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerate('scenarios')}
                      disabled={isRegenerating}
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <Collapsible
                      key={scenario.id}
                      open={expandedScenarios.includes(scenario.id)}
                      onOpenChange={() => toggleScenario(scenario.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            {expandedScenarios.includes(scenario.id) ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                              <p className="text-sm text-gray-600">{scenario.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(scenario.priority)} variant="secondary">
                              {scenario.priority}
                            </Badge>
                            <Badge variant="outline">
                              {scenario.status}
                            </Badge>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 ml-8 space-y-2">
                          {testCases
                            .filter(tc => tc.scenarioId === scenario.id)
                            .map((testCase) => (
                              <div key={testCase.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900">{testCase.title}</h5>
                                  <Badge className={getPriorityColor(testCase.priority)} variant="secondary">
                                    {testCase.priority}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Steps:</p>
                                    <ol className="text-sm text-gray-600 space-y-1">
                                      {testCase.steps.map((step, index) => (
                                        <li key={index} className="flex items-start">
                                          <span className="mr-2 text-blue-600 font-medium">{index + 1}.</span>
                                          {step}
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Expected Result:</p>
                                    <p className="text-sm text-gray-600">{testCase.expectedResult}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Data */}
          <div>
            <Card className="shadow-lg border-gray-200 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Test Data</CardTitle>
                    <CardDescription>Generated test data sets</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPromptModal('data')}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerate('data')}
                      disabled={isRegenerating}
                    >
                      <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testData.map((data) => (
                    <div key={data.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs mb-1">
                          {data.category}
                        </Badge>
                        <h4 className="font-medium text-gray-900 text-sm">{data.field}</h4>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-green-700 mb-1">Valid Values:</p>
                          <div className="flex flex-wrap gap-1">
                            {data.validValues.map((value, index) => (
                              <Badge key={index} className="text-xs bg-green-100 text-green-800" variant="secondary">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-red-700 mb-1">Invalid Values:</p>
                          <div className="flex flex-wrap gap-1">
                            {data.invalidValues.map((value, index) => (
                              <Badge key={index} className="text-xs bg-red-100 text-red-800" variant="secondary">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Generation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Test Scenarios</span>
                    <Badge variant="outline">{scenarios.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Test Cases</span>
                    <Badge variant="outline">{testCases.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Sets</span>
                    <Badge variant="outline">{testData.length}</Badge>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Coverage</span>
                      <Badge className="bg-blue-100 text-blue-800" variant="secondary">High</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <PromptEditModal
          isOpen={isPromptModalOpen}
          onClose={() => setIsPromptModalOpen(false)}
          type={promptType}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  );
};

export default WorkflowResult;
