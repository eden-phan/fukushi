"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableHead,
  UITableRow,
  UITableCell,
} from "@/components/customs/ui-table";
import { Plus } from "lucide-react";
import FormFamilyMemberDialog from "../dialogs/form-familiy-member-dialog";
import { UISkeleton } from "@/components/customs/ui-skeleton";
import { Trash2, SquarePen } from "lucide-react";
import { getLivingStatusLabel } from "@/lib/utils";

type ListFamilyMemberProps = {
  familyMembers?: FamilyMemberProps[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMemberProps[]>>;
  loading?: boolean;
};

export default function ListFamilyMember({
  familyMembers,
  setFamilyMembers,
  loading,
}: ListFamilyMemberProps) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isOpenFormDialog, setIsOpenFormDialog] = useState<boolean>(false);
  const [selectedFamilyMember, setSelectedFamilyMember] =
    useState<FamilyMemberProps>();

  const handleDelete = (id: number) => {
    setFamilyMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleEdit = (familyMember: FamilyMemberProps) => {
    setIsEditMode(true);
    setSelectedFamilyMember(familyMember);
    setIsOpenFormDialog(true);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setIsOpenFormDialog(true);
          }}
          className="bg-sky-500 hover:bg-sky-600 rounded-[4px] cursor-pointer"
        >
          <Plus className="w-5 h-5 text-white" />
          追加
        </Button>
      </div>
      <div className="border border-gray-200 mt-4">
        <UITable>
          <UITableHeader>
            <UITableRow className="bg-gray-200 hover:bg-gray-200">
              <UITableHead className="text-foreground font-bold">
                続柄
              </UITableHead>
              <UITableHead className="text-foreground font-bold">
                氏名
              </UITableHead>
              <UITableHead className="text-foreground font-bold">
                年齢
              </UITableHead>
              <UITableHead className="text-foreground font-bold">
                同居
              </UITableHead>
              <UITableHead className="text-foreground font-bold">
                特記事項
              </UITableHead>
              <UITableHead className="text-foreground font-bold">
                操作
              </UITableHead>
            </UITableRow>
          </UITableHeader>
          <UITableBody>
            {loading ? (
              <>
                {Array.from({ length: 1 }).map((_, rowIndex) => (
                  <UITableRow key={rowIndex}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <UITableCell key={cellIndex}>
                        <UISkeleton />
                      </UITableCell>
                    ))}
                  </UITableRow>
                ))}
              </>
            ) : familyMembers?.length === 0 ? (
              <UITableRow className="hover:bg-transparent">
                <UITableCell
                  colSpan={6}
                  className="p-5 text-gray-400 text-center"
                >
                  データなし
                </UITableCell>
              </UITableRow>
            ) : (
              familyMembers?.map((item: FamilyMemberProps, rowIndex) => (
                <UITableRow key={rowIndex}>
                  <UITableCell>{item.relationship}</UITableCell>
                  <UITableCell>{item.name}</UITableCell>
                  <UITableCell>{item.age}</UITableCell>
                  <UITableCell>
                    {getLivingStatusLabel(+item.living_status)}
                  </UITableCell>
                  <UITableCell>{item.note}</UITableCell>
                  <UITableCell>
                    <div className="flex gap-2 items-center">
                      <SquarePen
                        className="cursor-pointer"
                        onClick={() => {
                          handleEdit(item);
                        }}
                      />
                      <Trash2
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      />
                    </div>
                  </UITableCell>
                </UITableRow>
              ))
            )}
          </UITableBody>
        </UITable>
      </div>

      <FormFamilyMemberDialog
        open={isOpenFormDialog}
        onOpenChange={setIsOpenFormDialog}
        setFamilyMembers={setFamilyMembers}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        data={selectedFamilyMember}
      />
    </>
  );
}
