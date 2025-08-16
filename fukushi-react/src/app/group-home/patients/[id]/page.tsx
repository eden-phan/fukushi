import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./profile";
import SupportPlan from "./support-plan";
import TabIncident from "./tabs/incidents/tab-incident";
import TabProvisionLog from "./tabs/provision-log/tab-provision-log";
import { TabAssessment } from "./tabs/assessment/tab-assessment";

const page = () => {
  return (
    <>
      <Tabs defaultValue="profile" className="pt-8">
        <TabsList className="bg-transparent gap-12 border-b-2 rounded-none pb-0 ">
          <TabsTrigger
            className="font-bold data-[state=active]:bg-transparent"
            value="profile"
          >
            基本情報
          </TabsTrigger>
          <TabsTrigger
            className="font-bold data-[state=active]:bg-transparent"
            value="assessment"
          >
            アセスメント
          </TabsTrigger>
          <TabsTrigger
            className="font-bold data-[state=active]:bg-transparent"
            value="support-plan"
          >
            個人情報同意書
          </TabsTrigger>
          <TabsTrigger
            className="font-bold data-[state=active]:bg-transparent"
            value="provision-log"
          >
            個別支援計画
          </TabsTrigger>
          <TabsTrigger
            className="font-bold data-[state=active]:bg-transparent"
            value="incidents"
          >
            ヒヤリハット
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="support-plan">
          <SupportPlan />
        </TabsContent>
        <TabsContent value="provision-log">
          <TabProvisionLog />
        </TabsContent>
        <TabsContent value="incidents">
          <TabIncident />
        </TabsContent>
        <TabsContent value="assessment">
          <TabAssessment />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default page;
