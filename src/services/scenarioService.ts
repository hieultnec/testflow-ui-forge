
import apiClient from '@/config/api';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  version: string;
  priority: 'High' | 'Medium' | 'Low';
  test_cases?: TestCase[];
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expected_result: string;
  status: 'untested' | 'passed' | 'failed';
  version: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScenarioData {
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export const scenarioService = {
  // Get all scenarios for a project
  async getScenarios(projectId: string): Promise<Scenario[]> {
    const response = await apiClient.get(`/api/scenario/list?project_id=${projectId}`);
    return response.data.result || response.data;
  },

  // Get specific scenario by ID
  async getScenario(projectId: string, scenarioId: string): Promise<Scenario> {
    const response = await apiClient.get(`/api/scenario/get?project_id=${projectId}&scenario_id=${scenarioId}`);
    return response.data.result || response.data;
  },

  // Create scenario (using update for now as there's no create endpoint)
  async createScenario(projectId: string, data: CreateScenarioData): Promise<Scenario> {
    const response = await apiClient.put('/api/scenario/update', {
      project_id: projectId,
      scenario_id: '', // Will be generated by backend
      scenario_data: {
        ...data,
        version: '1.0',
        lastUpdated: new Date().toISOString(),
      },
    });
    return response.data.result || response.data;
  },

  // Update scenario
  async updateScenario(projectId: string, scenarioId: string, data: Partial<Scenario>): Promise<Scenario> {
    const response = await apiClient.put('/api/scenario/update', {
      project_id: projectId,
      scenario_id: scenarioId,
      scenario_data: data,
    });
    return response.data.result || response.data;
  },

  // Delete scenario
  async deleteScenario(projectId: string, scenarioId: string): Promise<void> {
    await apiClient.delete(`/api/scenario/delete?project_id=${projectId}&scenario_id=${scenarioId}`);
  },

  // Save all scenarios
  async saveScenarios(projectId: string, scenarios: Scenario[]): Promise<void> {
    await apiClient.post('/api/scenario/save', {
      project_id: projectId,
      scenarios,
    });
  },
};
