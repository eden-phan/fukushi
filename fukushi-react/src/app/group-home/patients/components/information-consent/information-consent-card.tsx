import Item from '@/components/customs/profile-item'
import React from 'react'
import { UIFileUpload } from '@/components/customs/ui-file-upload';


type Props = {
    data?: DocumentProps
}



const InformationConsentCard = ({ data }: Props) => {

    const getMetadataValue = (key: string): string => {
        const item = data?.document_metadata?.find((meta) => meta.key === key);
        return item?.value ?? "";
    };

    return (
        <div className="grid grid-cols-2 gap-y-3">
            <Item className='p-4 border-b-2' label="同意日" value={data?.start_date ?? ""} />
            <Item className='p-4 border-b-2' label="有効期限" value={data?.end_date ?? ""} />
            <Item className='p-4 border-b-2' label="利用者代理人" value={data?.staff?.profile?.fullname ?? ""} />
            <Item className='p-4 border-b-2' label="家族代表者" value={getMetadataValue("family_name")} />
            <UIFileUpload
                onFileUpload={() => {
                }}
                mediaId={data?.file}
                isPreview
            />
        </div>
    )
}

export default InformationConsentCard