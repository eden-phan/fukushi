"use client";

import { useState } from "react";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
  UITableCaption,
} from "@/components/customs/ui-table";
import { DeleteDocumentConsentDialog } from "../dialogs/delete-document-consent-dialog";
import { UISkeleton } from "@/components/customs/ui-skeleton";
import UIPagination from "@/components/customs/ui-pagination";
import {
  getDocumentConsentStatusLabel,
  getDocumentConsentStatusColor,
} from "@/lib/utils";
import { UIRemoveButton, UIUpdateButton } from "@/components/customs/ui-button";

type ListDocumentConsentProps = {
  data: PaginatedResponse<DocumentConsentProps> | undefined;
  onRefresh: () => void;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function ListDocumentConsent({
  data,
  onRefresh,
  loading,
  currentPage,
  onPageChange,
}: ListDocumentConsentProps) {
  const [isOpenDelDialog, setIsOpenDelDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DocumentConsentProps>();

  const handleOpenDelDialog = (item: DocumentConsentProps) => {
    setSelectedItem(item);
    setIsOpenDelDialog(true);
  };

  return (
    <div className=" p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <UITable>
        <UITableCaption>
          <div className="flex">
            {data && data.data.length > 0 && (
              <p className="text-neutral">
                {data?.total || 0} 件中 {data?.from || 0} から {data?.to || 0}{" "}
                まで表示
              </p>
            )}
          </div>
        </UITableCaption>
        <UITableHeader>
          <UITableRow>
            <UITableHead>利用者氏名</UITableHead>
            <UITableHead>続柄・代理人氏名</UITableHead>
            <UITableHead>同意日</UITableHead>
            <UITableHead>ステータス</UITableHead>
            <UITableHead></UITableHead>
          </UITableRow>
        </UITableHeader>
        <UITableBody>
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <UITableRow key={rowIndex}>
                  {Array.from({ length: 9 }).map((_, cellIndex) => (
                    <UITableCell key={cellIndex}>
                      <UISkeleton />
                    </UITableCell>
                  ))}
                </UITableRow>
              ))}
            </>
          ) : data?.data.length === 0 ? (
            <UITableRow className="hover:bg-transparent">
              <UITableCell
                colSpan={9}
                className="p-0 pt-9 text-gray-400 text-center"
              >
                データなし
              </UITableCell>
            </UITableRow>
          ) : (
            data?.data.map((item) => (
              <UITableRow key={item.id}>
                <UITableCell>{item.profile?.fullname}</UITableCell>
                <UITableCell>
                  {item.agent?.relationship} • {item.agent?.name}
                </UITableCell>
                <UITableCell>{item.document_date}</UITableCell>
                <UITableCell
                  className={getDocumentConsentStatusColor(+item.status)}
                >
                  {getDocumentConsentStatusLabel(+item.status)}
                </UITableCell>
                <UITableCell>
                  <div className="flex items-center gap-3">
                    <UIUpdateButton
                      url={`/group-home/document-consent/edit/${item.id}`}
                    >
                      編集
                    </UIUpdateButton>

                    <UIRemoveButton onClick={() => handleOpenDelDialog(item)}>
                      削除
                    </UIRemoveButton>
                  </div>
                </UITableCell>
              </UITableRow>
            ))
          )}
        </UITableBody>
      </UITable>
      <div>
        {data && data.last_page > 1 && (
          <div className="mt-4">
            <UIPagination
              currentPage={currentPage}
              lastPage={data.last_page}
              onPageChange={onPageChange}
            ></UIPagination>
          </div>
        )}
      </div>

      <DeleteDocumentConsentDialog
        open={isOpenDelDialog}
        onOpenChange={setIsOpenDelDialog}
        documentConsent={selectedItem}
        onRefresh={onRefresh}
      />
    </div>
  );
}
