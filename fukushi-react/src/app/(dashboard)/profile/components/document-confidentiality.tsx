"use client";
import Item from '@/components/customs/profile-item'
import http from '@/services/http';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'

type Props = {
  userId?: string;
}

const DocumentConfidentiality = ({userId}: Props) => {

  const [document, setDocument] = useState<DocumentConfidentialityProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await http.get(`/document-confidentiality/${userId}`);
      setDocument(response.data.data);
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
        <Item label="契約締結日" value={document?.document_date ?? ""} />
      </div>
    </div>
  )
}

export default DocumentConfidentiality