"use client";
import { HeadingPage } from '@/components/ui/heading-page'
import React, { useEffect, useState } from 'react'
import InformationConsentCard from '../components/information-consent/information-consent-card';
import InformationConsentForm from '../components/information-consent/information-consent-form';
import http from '@/services/http';
import { useParams } from 'next/navigation';
import { UserProps } from '@/@types/user';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InformationConsent = () => {
  const param = useParams();
  const patientId = param.id as string;
  const [addItem, setAddItem] = useState(false);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setAddItem(true);
  }

  const handleBackToList = () => {
    setAddItem(false);
  }

  const fetchData = async () => {
    const response = await http.get(`information-consent/${patientId}`)
    setData(response.data.data);
  }

  const fetchUsers = async () => {
    try {
      const response = await http.get(`/user/staff`);
      setUsers(response.data.data);
    } catch (error) {
      console.log("Fail to fetch staff", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchData(), fetchUsers()]);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
        setEdit(true)
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);


  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
      </div>
    )
  }

  return (
    <>
      <HeadingPage title="法定受領代理通知" />
      {addItem ? (
        <>

          <InformationConsentForm
            users={users}
            patientId={patientId}
            data={data}
            backToList={handleBackToList}
            refetchData={fetchData} />
        </>
      ) : (
        <div className='p-6 mt-6 rounded-2xl bg-white'>
          <div className="flex items-center gap-3">
            <Button
              className="bg-sky-500 hover:bg-sky-600 ml-auto rounded-[4px]"
              onClick={handleAddItem}
            >
              <Plus className="w-5 h-5 text-white" />
              {edit? '無効化' : '新規追加'}
            </Button>
          </div>
          <InformationConsentCard data={data} />
        </div>
      )}
    </>
  )
}

export default InformationConsent