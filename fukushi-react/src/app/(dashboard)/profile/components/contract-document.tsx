"use client"
import http from '@/services/http'
import React, { useState, useEffect } from 'react'
import Item from "@/components/customs/profile-item";
import { getDocumentTypeLabel, getStaffStatusLabel } from '@/lib/utils';
import { Loader2 } from 'lucide-react';


type Props = {
  userId?: string
}

const ContractAndDocument = ({ userId }: Props) => {
  const [contract, setContract] = useState<DocumentProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await http.get(`/document/user/${userId}`);
      setContract(response.data.data);
      setLoading(false);
    };

    fetchData()
  }, [userId])

  if (loading) {
     return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
            </div>
        )
  }
  return (
    <div className="p-6 max-w-6xl mx-auto text-sm space-y-8">
      <div className="grid grid-cols-2 gap-y-3 gap-x-16">
        <Item label="雇用形態" value={getDocumentTypeLabel(contract?.document_type) ?? ""} />
        <Item label="ステータス" value={getStaffStatusLabel(contract?.status) ?? ""} />
        <Item label="契約開始日" value={contract?.start_date ?? ""} />
        <Item label="契約満了日" value={contract?.end_date ?? ""} />
      </div>
    </div>
  )
}

export default ContractAndDocument