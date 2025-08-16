"use client";
// import Item from '@/components/customs/profile-item';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import http from '@/services/http';
import { cn, getAgeFromDob, getGenderLabel, getPatientStatusLabel } from '@/lib/utils';
import { HeadingPage } from '@/components/ui/heading-page';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UISkeleton } from '@/components/customs/ui-skeleton';
import PatientProfileForm from './tabs/profile/patient-profile-form';
import { StaffStatusEnum } from '@/lib/enum';
import { UIFileUpload } from '@/components/customs/ui-file-upload';



const Profile = () => {
    const params = useParams();
    const id = params?.id as string;
    const [patient, setPatient] = useState<patientProps>()
    const profile = patient?.profile;
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true)
        const response = await http.get(`service-user/${id}`);
        setPatient(response.data.data);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    type items = {
        label: string;
        value: string;
        className?: string
    }

    const Item = ({ label, value, className }: items) => {
        return (
            <div className={cn("grid grid-cols-[160px_1fr]", className)}>
                <p className="font-semibold">{label}</p>
                <p>{value}</p>
            </div>
        )
    }

    const handleRefresh = () => {
        fetchData()
        setEditMode(false);
    }

    return (
        <>
            <div className="flex justify-between mb-6">
                <HeadingPage title="利用者詳細" />

            </div>
            <div className='bg-white rounded-2xl mt-4'>
                <div className="p-6 max-w-6xl mx-auto text-sm pb-20 text-black space-y-8">
                    {loading ? (
                        <>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <UISkeleton key={i} className="h-4 w-full border rounded" />
                            ))}
                        </>
                    ) : (editMode ? (
                        <PatientProfileForm data={patient} edit={handleRefresh} />
                    ) : (
                        <>
                            <div className="flex justify-end gap-4">
                                <Link href="/group-home/patients">
                                    <Button variant={'outline'}>
                                        <ArrowLeft size={16} className="mr-2" />
                                        戻る
                                    </Button>
                                </Link>
                                <Button
                                    className="bg-sky-500 hover:bg-sky-600 rounded-[4px]"
                                    onClick={() => setEditMode(true)}
                                >
                                    編集
                                </Button>
                            </div>
                            <Item className='p-4 border-b-2' label="ID" value={patient?.id ?? ""} />
                            <div className="grid grid-cols-2 gap-y-3">
                                <Item className='p-4 border-b-2' label="氏名" value={profile?.fullname ?? ''} />
                                <Item className='p-4 border-b-2' label="フリガナ" value={profile?.furigana ?? ''} />
                                <Item className='p-4 border-b-2' label="生年月日" value={profile?.dob ?? ''} />
                                <Item className='p-4 border-b-2' label="年齢" value={getAgeFromDob(profile?.dob ?? '')} />
                                <Item className='p-4 border-b-2' label="性別" value={getGenderLabel(profile?.gender ?? '')} />
                                <Item className='p-4 border-b-2' label="電話番号" value={profile?.phone_number ?? ''} />
                            </div>
                            <Item className='p-4 border-b-2' label="住所"
                                value={`${profile?.address ?? ''}${profile?.district ? `, ${profile.district}` : ''}${profile?.prefecture ? `, ${profile.prefecture}` : ''}`} />
                            <Item className='p-4 border-b-2' label="事業所" value="Group Home" />
                            <Item className='p-4 border-b-2' label="ステータス" value={getPatientStatusLabel(profile?.status ?? '')} />
                            {profile?.status === StaffStatusEnum.Expired && (
                                <div className="w-1/2">
                                    <UIFileUpload
                                        onFileUpload={() => { }}
                                        mediaId={profile.file}
                                        isPreview
                                    />
                                </div>
                            )}
                        </>
                    )
                    )}

                </div>
            </div >
        </>


    )
}

export default Profile