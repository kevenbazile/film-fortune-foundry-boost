
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveDistributions from './distribution/ActiveDistributions';
import PendingDistributions from './distribution/PendingDistributions';
import PlatformIssues from './distribution/PlatformIssues';
import SupportChatPanel from './SupportChatPanel';

const tabData = [
  { id: 'active', label: 'Active Distributions' },
  { id: 'pending', label: 'Pending Distributions' },
  { id: 'issues', label: 'Platform Issues' },
  { id: 'support', label: 'Support Chats' },
];

const DistributionManagement = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6 p-6 pb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Distribution Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage film distribution across platforms and handle customer support.
        </p>
      </div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          {tabData.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ActiveDistributions />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <PendingDistributions />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <PlatformIssues />
        </TabsContent>
        
        <TabsContent value="support" className="space-y-4">
          <SupportChatPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistributionManagement;
