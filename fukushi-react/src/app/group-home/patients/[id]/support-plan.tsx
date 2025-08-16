"use client";
import { HeadingPage } from '@/components/ui/heading-page'
import React, { useState } from 'react'
import CustomAddBtn from '@/components/customs/add-btn'
import ListSupportPlan from '../components/support-plan/list-support-plan'
import SupportPlanAddForm from '../components/support-plan/support-plan-add-form';

const SupportPlan = () => {
  const [addItem, setAddItem] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);

  const handleAddItem = () => {
    setAddItem(true);
    setEditId(undefined); 
  }

  const handleBackToList = () => {
    setAddItem(false);
    setEditId(undefined); 
  }

  const handleEditItem = (id: string) => {
    setAddItem(false);
    setEditId(id); 
  }
  
  return (
    <>
      <HeadingPage title="法定受領代理通知" />
      {addItem || editId ? (
        <>
          <SupportPlanAddForm editId={editId} backToList={handleBackToList} />
        </>
      ) : (
        <div className="">
          <div className="mt-6 flex items-center gap-3">
            <CustomAddBtn handleAddItem={handleAddItem} />
          </div>
          <ListSupportPlan handleEditItem={handleEditItem} />
        </div>
      )}
    </>
  )
}

export default SupportPlan