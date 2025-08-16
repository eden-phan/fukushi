'use client';
import Item from '@/components/customs/profile-item';
import { formatDate, getAgeFromDob, getEmployeeTypeLabel, getGenderLabel, getStaffReasonColor, getStaffReasonLabel, getStaffWorkTypeLabel } from '@/lib/utils';
import React from 'react'

type Props = {
    data?: StaffProps;
}


const Conclusion = ({ data }: Props) => {

    if (!data) {
        return <p className="p-6">データがありません (No Data)</p>;
    }

    return (
        <div className="mt-6 p-8 rounded-2xl rop-6 max-w-6xl mx-auto text-sm text-black bg-white space-y-8">
            <h2 className="font-bold text-[18px] mb-6">個人情報</h2>
            <div className="grid grid-cols-2 gap-y-3 gap-x-16">
                <Item label="氏名" value={data?.profile?.fullname} />
                <Item label="スタッフID" value={data?.id} />
                <Item label="生年月日" value={data?.profile?.dob} />
                <Item label="性別" value={getGenderLabel(data?.profile?.gender)} />
                <Item label="年齢" value={getAgeFromDob(data?.profile?.dob)} />
                <Item label="電話番号" value={data?.profile?.phone_number} />
                <Item label="メールアドレス" value={data?.email} />
                <Item label="住所" value={data?.profile?.address} />

            </div>

            <h2 className="font-bold text-[18px] mb-6">雇用情報</h2>
            <div className="grid grid-cols-2 gap-y-3 gap-x-16">
                <Item label="職種" value={getStaffWorkTypeLabel(data?.work_type)} />
                <Item label="入職日" value={formatDate(data?.profile?.dob)} />
                <Item label="契約タイプ" value={getEmployeeTypeLabel(data?.employment_type)} />
                <Item label="勤務状況" className={`text-[${getStaffReasonColor(data?.profile.status)}]`} value={getStaffReasonLabel(data?.profile.status)} />
            </div>
            {(data?.profile?.family_name || data?.profile?.relationship || data?.profile?.family_phone) && (
                <>
                    <h2 className="font-bold text-[18px] mb-6">緊急連絡先</h2>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-16">
                        <Item label="氏名（名前)" value={data?.profile?.family_name} />
                        <Item label="続柄" value={data?.profile?.relationship} />
                        <Item label="電話番号" value={data?.profile?.family_phone} />
                    </div>
                </>
            )}
        </div>
    )
}

export default Conclusion