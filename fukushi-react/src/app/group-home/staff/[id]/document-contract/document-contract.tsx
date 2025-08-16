"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import FormContract from "./form-contract";
import { Loader2 } from "lucide-react";
import http from "@/services/http";
import { getDocumentTypeLabel, getStaffStatusLabel } from "@/lib/utils";
import { UIFileUpload } from "@/components/customs/ui-file-upload";

type Props = {
  staffId: string;
};

const DocumentContract = ({ staffId }: Props) => {
  const [edit, setEdit] = useState(false);
  const [contract, setContract] = useState<DocumentProps>();
  const [loading, setLoading] = useState(true);
  const handleEdit = () => {
    setEdit(true);
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await http.get(`/document/user/${staffId}`);
    setContract(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, edit]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
      </div>
    )
  }
  return (
    <div className="mt-6 p-8 rounded-2xl bg-white max-w-6xl mx-auto text-sm space-y-8">
      {edit || !contract ? (
        <FormContract contract={contract} edit={setEdit} onfresh={fetchData} />
      ) : (
        <>
          <div className="flex justify-end">
            <Button variant="formSubmit" onClick={handleEdit}>
              {contract ? "保存" : "更新"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-16">
            <div className="grid gap-4">
              <p className="font-bold">契約タイプ</p>
              <p>{getDocumentTypeLabel(contract?.document_type) ?? ""}</p>
            </div>
            <div className="grid gap-4">
              <p className="font-bold">ステータス</p>
              <p>{getStaffStatusLabel(contract?.status) ?? ""}</p>
            </div>
            <div className="grid gap-4">
              <p className="font-bold">契約開始日</p>
              <p>{contract?.start_date ?? ""}</p>
            </div>
            <div className="grid gap-4">
              <p className="font-bold">契約満了日</p>
              {contract?.permanent_contract? 
              <p className="text-orange-400">無期契約</p> 
              : <p>{contract?.end_date ?? ""}</p>
              }
            </div>
            {contract?.file && (
              <div className="grid gap-4 w-1/2">
                <p className="font-bold">
                  契約書
                </p>
                <UIFileUpload
                  onFileUpload={() => { }}
                  mediaId={contract?.file}
                  isPreview
                />
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
};

export default DocumentContract;
