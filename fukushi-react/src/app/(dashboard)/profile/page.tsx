'use client';
import React, {useState, useEffect} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContractAndDocument from './components/contract-document'
import DocumentConfidentiality from './components/document-confidentiality'
import Information from './components/information/information';
import http from '@/services/http';

const Page = () => {

    const [userData, setUserData] = useState<StaffProps>();
    const [isEditMode, setIsEditMode] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            const response = await http.get('profile/me');
            setUserData(response.data);
        };
        fetchData();
    }, [isEditMode]);

    return (
        <>
            <div className="p-6 max-w-6xl mx-auto items-center">
                <Tabs defaultValue="infomation" className="pt-8">
                    <TabsList className="bg-transparent gap-12 border-b-2 rounded-none pb-0 ">
                        <TabsTrigger className="font-bold data-[state=active]:bg-transparent" value="infomation">
                            秘密保持契約の締結
                        </TabsTrigger>
                        <TabsTrigger className="font-bold data-[state=active]:bg-transparent" value="contractAndDocument">
                            契約書・書類
                        </TabsTrigger>
                        <TabsTrigger className="font-bold data-[state=active]:bg-transparent" value="trainingRecord">
                            研修記録
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="infomation">
                        <Information userData={userData} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
                    </TabsContent>
                    <TabsContent value="contractAndDocument">
                        <ContractAndDocument userId={userData?.id}/>
                    </TabsContent>
                    <TabsContent value="trainingRecord">
                        <DocumentConfidentiality userId={userData?.id} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default Page