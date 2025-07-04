
import React, { useState } from 'react';
import { Plus, Edit3, History, RefreshCw, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [scenarios] = useState<TestScenario[]>(mockScenarios);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Test Scenarios</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onOpenPromptModal}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Scenario
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
                      <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Version: {scenario.version}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Updated: {scenario.lastUpdated}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{scenario.testCasesCount} test cases</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(scenario.priority)} variant="secondary">
                      {scenario.priority}
                    </Badge>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 ml-8 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Actions</h5>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Test Cases
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit Scenario
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-1" />
                      Version History
                    </Button>
                    <Button variant="outline" size="sm" onClick={onOpenPromptModal}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestScenariosTab;
