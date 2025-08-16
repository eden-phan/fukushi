
type DocumentProps = {
    permanent_contract: boolean | null | undefined;
    id: string;
    document_type: DocumentTypeEnum;
    status: StaffStatusEnum | string;
    start_date: string;
    end_date: string;
    staff_id: string;
    document_metadata: documentMetadataProps[];
    staff: UserProps;
    file: number;
}