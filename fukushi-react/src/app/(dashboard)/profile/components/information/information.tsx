'use client';
import React from 'react';
import ProfileCard from './profile-card';
import FormProfile from './profile-form';
import { Loader2 } from 'lucide-react';
// import http from '@/services/http';


type Props = {
    userData?: StaffProps;
    isEditMode: boolean;
    setIsEditMode: (arg0: boolean) => void;
}

const Information = ({userData, isEditMode, setIsEditMode}: Props) => {

    if (!userData) 
    {
         return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                        <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
                    </div>
                )
    }

    return (
        <div className='bg-white p-8 mt-8 rounded-2xl'>
            <div className="p-6 max-w-6xl mx-auto text-sm text-black space-y-8">
                {isEditMode
                    ? (
                        <FormProfile staffData={userData} setIsEditMode={setIsEditMode} />
                    ) : (
                        <ProfileCard data={userData} setIsEditMode={setIsEditMode} />
                    )}
            </div>
        </div>

    )
}

export default Information