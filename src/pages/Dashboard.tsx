
import React, { useState } from 'react';
import { Plus, FileText, User, Clock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  version: string;
  owner: string;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Tests',
    description: 'Comprehensive test suite for the main e-commerce application',
    version: 'v2.1.3',
    owner: 'Sarah Chen',
    lastUpdated: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mobile App Authentication',
    description: 'Test scenarios for mobile app login and security features',
    version: 'v1.0.8',
    owner: 'Mike Rodriguez',
    lastUpdated: '1 day ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'Payment Gateway Integration',
    description: 'Testing payment processing and transaction flows',
    version: 'v3.2.1',
    owner: 'Alex Johnson',
    lastUpdated: '3 days ago',
    status: 'draft'
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects] = useState<Project[]>(mockProjects);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Management Dashboard</h1>
              <p className="text-gray-600">Manage your test projects and track version history</p>
            </div>
            <Link to="/create-project">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
          <Button variant="outline" className="px-4 py-3 border-gray-200 hover:bg-gray-50">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                      <Link to={`/project/${project.id}/workflow`}>
                        {project.name}
                      </Link>
                    </CardTitle>
                    <Badge className={getStatusColor(project.status)} variant="secondary">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {project.version}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    <span>{project.owner}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Updated {project.lastUpdated}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Link to={`/project/${project.id}/workflow`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:border-blue-200">
                        <FileText className="w-4 h-4 mr-2" />
                        View Tests
                      </Button>
                    </Link>
                    <Link to={`/project/${project.id}/versions`}>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        History
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first test project</p>
            <Link to="/create-project">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
