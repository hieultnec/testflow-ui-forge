
import React, { useState } from 'react';
import { Plus, Download, Edit3, Upload, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TestData {
  id: string;
  testCaseId: string;
  testCaseName: string;
  inputValues: Record<string, any>;
  outputExpectation: string;
  usedInRun: boolean;
  version: string;
  lastUpdated: string;
}

interface TestDataTabProps {
  onOpenPromptModal: () => void;
}

const mockTestData: TestData[] = [
  {
    id: '1',
    testCaseId: '1',
    testCaseName: 'Register with valid email',
    inputValues: {
      email: 'user@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    },
    outputExpectation: 'Registration successful',
    usedInRun: true,
    version: 'v1.2',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    testCaseId: '2',
    testCaseName: 'Register with invalid email format',
    inputValues: {
      email: 'invalid@',
      password: 'password123',
      confirmPassword: 'password123'
    },
    outputExpectation: 'Email validation error',
    usedInRun: false,
    version: 'v1.1',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    testCaseId: '3',
    testCaseName: 'Process credit card payment',
    inputValues: {
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123',
      amount: 99.99
    },
    outputExpectation: 'Payment processed successfully',
    usedInRun: true,
    version: 'v1.0',
    lastUpdated: '2024-01-13'
  }
];

const TestDataTab: React.FC<TestDataTabProps> = ({ onOpenPromptModal }) => {
  const [testData] = useState<TestData[]>(mockTestData);

  const formatInputValues = (values: Record<string, any>) => {
    return Object.entries(values)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Test Data</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={onOpenPromptModal}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Case ID</TableHead>
                <TableHead>Test Case Name</TableHead>
                <TableHead>Input Values</TableHead>
                <TableHead>Output Expectation</TableHead>
                <TableHead>Used in Run</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{data.testCaseId}</TableCell>
                  <TableCell>{data.testCaseName}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={formatInputValues(data.inputValues)}>
                      {formatInputValues(data.inputValues)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={data.outputExpectation}>
                      {data.outputExpectation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={data.usedInRun ? "default" : "secondary"}
                      className={data.usedInRun ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {data.usedInRun ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>{data.version}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <History className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
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
  );
};

export default TestDataTab;
