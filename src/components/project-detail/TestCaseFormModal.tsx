
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
  prefilledScenarioId?: string;
}

const TestCaseFormModal: React.FC<TestCaseFormModalProps> = ({ 
  isOpen, 
  onClose, 
  testCase, 
  mode,
  prefilledScenarioId 
}) => {
  const [steps, setSteps] = useState<string[]>(testCase?.steps || ['']);
  const [tags, setTags] = useState<string[]>(testCase?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(prefilledScenarioId || testCase?.scenarioId || '');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TestCaseFormData>({
    defaultValues: testCase || { name: '', scenarioId: prefilledScenarioId || '', expectedResult: '', steps: [''], tags: [] }
  });

  React.useEffect(() => {
    if (prefilledScenarioId) {
      setSelectedScenario(prefilledScenarioId);
      setValue('scenarioId', prefilledScenarioId);
    }
  }, [prefilledScenarioId, setValue]);

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
      scenarioId: selectedScenario,
      steps: steps.filter(step => step.trim() !== ''),
      tags
    };
    console.log(`${mode} test case:`, formData);
    // Here you would handle the actual create/update
    reset();
    setSteps(['']);
    setTags([]);
    setSelectedScenario('');
    onClose();
  };

  const handleClose = () => {
    reset();
    setSteps(['']);
    setTags([]);
    setSelectedScenario('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">
            {mode === 'create' ? 'Create New Test Case' : 'Edit Test Case'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {mode === 'create' 
              ? 'Define a new test case with steps, expected results, and tags.'
              : 'Update the test case details.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Test Case Name</Label>
            <Input
              id="name"
              placeholder="e.g., Register with valid email"
              className="text-sm"
              {...register('name', { required: 'Test case name is required' })}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenarioId" className="text-sm">Test Scenario</Label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger className="text-sm">
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
            <Label className="text-sm">Test Steps</Label>
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  className="text-sm"
                  onChange={(e) => updateStep(index, e.target.value)}
                />
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-2 py-1"
                    onClick={() => removeStep(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addStep} className="px-3 py-1">
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedResult" className="text-sm">Expected Result</Label>
            <Textarea
              id="expectedResult"
              placeholder="Describe the expected outcome..."
              rows={3}
              className="text-sm resize-none"
              {...register('expectedResult', { required: 'Expected result is required' })}
            />
            {errors.expectedResult && (
              <p className="text-xs text-red-600">{errors.expectedResult.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Tags</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-0">
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
                className="text-sm"
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag} className="px-3 py-1">
                Add
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="px-4 py-2">
              Cancel
            </Button>
            <Button type="submit" className="px-4 py-2">
              {mode === 'create' ? 'Create Test Case' : 'Update Test Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseFormModal;
