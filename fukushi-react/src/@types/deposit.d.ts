type DepositProps = {
    total_amount: string;
    id: string;
    pickup_date:string;
    return_date:string;
    status: DepositStatusEnum | null | undefined;
    service_user: patientProps;
    user: UserProps
}