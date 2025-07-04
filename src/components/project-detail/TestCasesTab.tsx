
import React, { useState } from 'react';
import { Plus, Edit3, History, Copy, Database, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import TestCaseFormModal from './TestCaseFormModal';

interface TestCase {
  id: string;
  name: string;
  scenarioId: string;
  scenarioName: string;
  expectedResult: string;
  steps: string[];
  tags: string[];
  version: string;
  lastUpdated: string;
}

interface TestCasesTabProps {
  onOpenPromptModal: () => void;
}

const mockTestCases: TestCase[] = [
  {
    id: '1',
    name: 'Register with valid email',
    scenarioId: '1',
    scenarioName: 'User Registration Flow',
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
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Register with invalid email format',
    scenarioId: '1',
    scenarioName: 'User Registration Flow',
    expectedResult: 'Error message displayed for invalid email format',
    steps: [
      'Navigate to registration page',
      'Enter invalid email format (e.g., invalid@)',
      'Enter password',
      'Click Register button'
    ],
    tags: ['Negative', 'Validation'],
    version: 'v1.1',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    name: 'Process credit card payment',
    scenarioId: '2',
    scenarioName: 'Payment Processing',
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
    lastUpdated: '2024-01-13'
  }
];

const TestCasesTab: React.FC<TestCasesTabProps> = ({ onOpenPromptModal }) => {
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [expandedCases, setExpandedCases] = useState<string[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState<TestCase | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const toggleTestCase = (caseId: string) => {
    setExpandedCases(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleCreateTestCase = () => {
    setModalMode('create');
    setEditingTestCase(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditTestCase = (testCase: TestCase) => {
    setModalMode('edit');
    setEditingTestCase(testCase);
    setIsFormModalOpen(true);
  };

  const handleDuplicateTestCase = (testCase: TestCase) => {
    const duplicated = {
      ...testCase,
      id: Date.now().toString(),
      name: `${testCase.name} (Copy)`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTestCases(prev => [...prev, duplicated]);
  };

  const handleDeleteTestCase = (testCaseId: string) => {
    setTestCases(prev => prev.filter(tc => tc.id !== testCaseId));
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Regression': 'bg-blue-100 text-blue-800',
      'Smoke': 'bg-green-100 text-green-800',
      'Critical': 'bg-red-100 text-red-800',
      'Negative': 'bg-orange-100 text-orange-800',
      'Validation': 'bg-purple-100 text-purple-800',
      'Integration': 'bg-indigo-100 text-indigo-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Cases</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onOpenPromptModal}>
                <Database className="w-4 h-4 mr-2" />
                Generate Test Data
              </Button>
              <Button size="sm" onClick={handleCreateTestCase}>
                <Plus className="w-4 h-4 mr-2" />
                Add Test Case
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <Collapsible
                key={testCase.id}
                open={expandedCases.includes(testCase.id)}
                onOpenChange={() => toggleTestCase(testCase.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      {expandedCases.includes(testCase.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{testCase.name}</h4>
                        <p className="text-sm text-gray-600">Scenario: {testCase.scenarioName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {testCase.tags.map((tag) => (
                            <Badge key={tag} className={getTagColor(tag)} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Version: {testCase.version}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Updated: {testCase.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 ml-8 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Steps:</h6>
                        <ol className="space-y-1">
                          {testCase.steps.map((step, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-700">
                              <span className="mr-2 text-blue-600 font-medium">{index + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Expected Result:</h6>
                        <p className="text-sm text-gray-700">{testCase.expectedResult}</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => handleEditTestCase(testCase)}>
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDuplicateTestCase(testCase)}>
                          <Copy className="w-4 h-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="w-4 h-4 mr-1" />
                          History
                        </Button>
                        <Button variant="outline" size="sm">
                          <Database className="w-4 h-4 mr-1" />
                          Generate Data
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Test Case</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{testCase.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTestCase(testCase.id)} className="bg-red-600 hover:bg-red-700">
                                Delete Test Case
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      <TestCaseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        testCase={editingTestCase}
        mode={modalMode}
      />
    </>
  );
};

export default TestCasesTab;
