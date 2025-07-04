
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface ScenarioFormData {
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface ScenarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario?: ScenarioFormData & { id: string };
  mode: 'create' | 'edit';
}

const ScenarioFormModal: React.FC<ScenarioFormModalProps> = ({ 
  isOpen, 
  onClose, 
  scenario, 
  mode 
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ScenarioFormData>({
    defaultValues: scenario || { name: '', description: '', priority: 'Medium' }
  });

  React.useEffect(() => {
    if (scenario && mode === 'edit') {
      setValue('name', scenario.name);
      setValue('description', scenario.description);
      setValue('priority', scenario.priority);
    }
  }, [scenario, mode, setValue]);

  const onSubmit = (data: ScenarioFormData) => {
    console.log(`${mode} scenario:`, data);
    // Here you would handle the actual create/update
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Test Scenario' : 'Edit Test Scenario'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Define a new test scenario with name, description, and priority.'
              : 'Update the test scenario details.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Scenario Name</Label>
            <Input
              id="name"
              placeholder="e.g., User Registration Flow"
              {...register('name', { required: 'Scenario name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the test scenario in detail..."
              rows={4}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select defaultValue="Medium">
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Scenario' : 'Update Scenario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioFormModal;
