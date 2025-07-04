
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface TestCaseFormData {
  name: string;
  scenarioId: string;
  expectedResult: string;
  steps: string[];
  tags: string[];
}

interface TestCaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  testCase?: TestCaseFormData & { id: string };
  mode: 'create' | 'edit';
}

const TestCaseFormModal: React.FC<TestCaseFormModalProps> = ({ 
  isOpen, 
  onClose, 
  testCase, 
  mode 
}) => {
  const [steps, setSteps] = useState<string[]>(testCase?.steps || ['']);
  const [tags, setTags] = useState<string[]>(testCase?.tags || []);
  const [newTag, setNewTag] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TestCaseFormData>({
    defaultValues: testCase || { name: '', scenarioId: '', expectedResult: '', steps: [''], tags: [] }
  });

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: TestCaseFormData) => {
    const formData = {
      ...data,
      steps: steps.filter(step => step.trim() !== ''),
      tags
    };
    console.log(`${mode} test case:`, formData);
    // Here you would handle the actual create/update
    reset();
    setSteps(['']);
    setTags([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setSteps(['']);
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Test Case' : 'Edit Test Case'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Define a new test case with steps, expected results, and tags.'
              : 'Update the test case details.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Test Case Name</Label>
            <Input
              id="name"
              placeholder="e.g., Register with valid email"
              {...register('name', { required: 'Test case name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenarioId">Test Scenario</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">User Registration Flow</SelectItem>
                <SelectItem value="2">Payment Processing</SelectItem>
                <SelectItem value="3">Product Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Test Steps</Label>
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                />
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStep(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addStep}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedResult">Expected Result</Label>
            <Textarea
              id="expectedResult"
              placeholder="Describe the expected outcome..."
              rows={3}
              {...register('expectedResult', { required: 'Expected result is required' })}
            />
            {errors.expectedResult && (
              <p className="text-sm text-red-600">{errors.expectedResult.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., Regression, Smoke)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Test Case' : 'Update Test Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseFormModal;
