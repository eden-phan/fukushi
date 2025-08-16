<?php

namespace Modules\Consultation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConsultationFamilyMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consultation.facility_id' => 'nullable',

            /**Basic information */
            'consultation.date' => 'required|date_format:Y-m-d',
            'consultation.furigana' => 'required|string',
            'consultation.full_name' => 'required|string',
            'consultation.method' => 'required|string',
            'consultation.transit_agency' => 'required|string',
            'consultation.staff_id' => 'required|integer|exists:users,id',
            'consultation.gender' => 'required|integer',

            /**User information */
            'consultation.disability_certificate_type' => 'required|string',
            'consultation.disability_category' => 'required|integer',
            'consultation.disability_level' => 'required|integer',
            'consultation.dob' => 'required|date_format:Y-m-d',
            'consultation.postal_code' => 'required|string',
            'consultation.prefecture' => 'required|string',
            'consultation.district' => 'required|string',
            'consultation.address' => 'required|string',
            'consultation.telephone' => 'required|string',
            'consultation.fax' => 'required|string',
            'consultation.disability_name' => 'required|string',

            /**Consultation information */
            'consultation.consultant_name' => 'required|string',
            'consultation.consultant_relationship' => 'required|string',
            'consultation.consultant_postal_code' => 'required|string',
            'consultation.consultant_prefecture' => 'required|string',
            'consultation.consultant_district' => 'required|string',
            'consultation.consultant_street' => 'required|string',
            'consultation.consultant_telephone' => 'required|string',
            'consultation.consultant_fax' => 'required|string',

            /**Other contact information */
            'consultation.other_contact_fullname' => 'required|string',
            'consultation.other_contact_address' => 'required|string',
            'consultation.other_contact_telephone' => 'required|string',
            'consultation.other_contact_fax' => 'required|string',

            /**Consultation content */
            'consultation.consultation_content' => 'required|string',
            'consultation.current_services' => 'required|string',
            'consultation.desired_use_status' => 'required|integer',
            'consultation.desired_admission_date' => 'nullable',
            'consultation.note' => 'required|string',
            'consultation.response_status' => 'required|integer',
            'consultation.referral_facility_id' => 'nullable',
            'consultation.home_visit_schedule' => 'required|date_format:Y-m-d',
            'consultation.next_visit_schedule' => 'required|date_format:Y-m-d',

            /**Consultation accept */
            'consultation.accept_status' => 'nullable',

            /**Create record information */
            'consultation.created_by' => 'nullable',

            /**Family members array */
            'family_members' => 'nullable|array',
            'family_members.*.id' => 'nullable',
            'family_members.*.name' => 'required|string',
            'family_members.*.age' => 'required|integer',
            'family_members.*.relationship' => 'required|string',
            'family_members.*.occupation' => 'required|string',
            'family_members.*.living_status' => 'required|integer',
            'family_members.*.note' => 'required|string',
            'family_members.*.created_by' => 'required|integer|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            /**Basic information */
            'consultation.facility_id.required' => 'Facility is required.',
            'consultation.facility_id.integer' => 'Facility must be a valid number.',
            'consultation.facility_id.exists' => 'Selected facility does not exist.',
            'consultation.date.required' => 'Consultation date is required.',
            'consultation.date.date_format' => 'Consultation date must be in the format Y-m-d.',
            'consultation.furigana.required' => 'Furigana is required.',
            'consultation.furigana.string' => 'Furigana must be a string.',
            'consultation.full_name.required' => 'Full name is required.',
            'consultation.full_name.string' => 'Full name must be a string.',
            'consultation.method.required' => 'Consultation method is required.',
            'consultation.method.string' => 'Consultation method must be a string.',
            'consultation.transit_agency.required' => 'Transit agency is required.',
            'consultation.transit_agency.string' => 'Transit agency must be a string.',
            'consultation.staff_id.required' => 'Staff is required.',
            'consultation.staff_id.integer' => 'Staff ID must be a valid number.',
            'consultation.staff_id.exists' => 'Selected staff does not exist.',
            'consultation.gender.required' => 'Gender is required.',
            'consultation.gender.integer' => 'Gender must be a valid number.',

            /**User information */
            'consultation.disability_certificate_type.required' => 'Disability certificate type is required.',
            'consultation.disability_certificate_type.string' => 'Disability certificate must be a string.',
            'consultation.disability_category.required' => 'Disability category is required.',
            'consultation.disability_category.integer' => 'Disability category must be a valid number.',
            'consultation.disability_level.required' => 'Disability level is required.',
            'consultation.disability_level.integer' => 'Disability level must be a valid number.',
            'consultation.dob.required' => 'Date of birth is required.',
            'consultation.dob.date_format' => 'Date of birth must be in the format Y-m-d.',
            'consultation.postal_code.required' => 'Postal code is required.',
            'consultation.postal_code.string' => 'Postal code must be a string.',
            'consultation.prefecture.required' => 'Prefecture is required.',
            'consultation.prefecture.string' => 'Prefecture must be a string.',
            'consultation.district.required' => 'District is required.',
            'consultation.district.string' => 'District must be a string.',
            'consultation.address.required' => 'Address is required.',
            'consultation.address.string' => 'Address must be a string.',
            'consultation.telephone.required' => 'Telephone number is required.',
            'consultation.telephone.string' => 'Telephone must be a string.',
            'consultation.fax.required' => 'Fax number is required.',
            'consultation.fax.string' => 'Fax must be a string.',
            'consultation.disability_name.required' => 'Disability name is required.',
            'consultation.disability_name.string' => 'Disability must be a string.',

            /**Consultation information */
            'consultation.consultant_name.required' => 'Consultant name is required.',
            'consultation.consultant_name.string' => 'Consultant name must be a string.',
            'consultation.consultant_relationship.required' => 'Consultant relationship is required.',
            'consultation.consultant_relationship.string' => 'Consultant relationship must be a string.',
            'consultation.consultant_postal_code.required' => 'Consultant postal code is required.',
            'consultation.consultant_postal_code.string' => 'Consultant postal code must be a string.',
            'consultation.consultant_prefecture.required' => 'Consultant prefecture is required.',
            'consultation.consultant_prefecture.string' => 'Consultant prefecture must be a string.',
            'consultation.consultant_district.required' => 'Consultant district is required.',
            'consultation.consultant_district.string' => 'Consultant district must be a string.',
            'consultation.consultant_street.required' => 'Consultant street address is required.',
            'consultation.consultant_street.string' => 'Consultant street must be a string.',
            'consultation.consultant_telephone.required' => 'Consultant telephone number is required.',
            'consultation.consultant_telephone.string' => 'Consultant telephone must be a string.',
            'consultation.consultant_fax.required' => 'Consultant fax number is required.',
            'consultation.consultant_fax.string' => 'Consultant fax number must be a string.',

            /**Other contact information */
            'consultation.other_contact_fullname.required' => 'Other contact full name is required.',
            'consultation.other_contact_fullname.string' => 'Other contact full name must be a string.',
            'consultation.other_contact_address.required' => 'Other contact address is required.',
            'consultation.other_contact_address.string' => 'Other contact address must be a string.',
            'consultation.other_contact_telephone.required' => 'Other contact telephone number is required.',
            'consultation.other_contact_telephone.string' => 'Other contact telephone number must be a string.',
            'consultation.other_contact_fax.required' => 'Other contact fax number is required.',
            'consultation.other_contact_fax.string' => 'Other contact fax number must be a string.',


            /**Consultation content */
            'consultation.consultation_content.required' => 'Consultation content is required.',
            'consultation.consultation_content.string' => 'Consultation content must be a string.',
            'consultation.current_services.required' => 'Current services are required.',
            'consultation.current_services.string' => 'Current services must be a string.',
            'consultation.desired_use_status.required' => 'Desired use status is required.',
            'consultation.desired_use_status.integer' => 'Desired use status must be a valid number.',
            'consultation.note.required' => 'Note is required.',
            'consultation.note.string' => 'Note must be a string.',
            'consultation.response_status.required' => 'Response status is required.',
            'consultation.response_status.integer' => 'Response status must be a valid number.',
            'consultation.home_visit_schedule.required' => 'Home visit schedule is required.',
            'consultation.home_visit_schedule.date_format' => 'Home visit schedule must be in the format Y-m-d.',
            'consultation.next_visit_schedule.required' => 'Next visit schedule is required.',
            'consultation.next_visit_schedule.date_format' => 'Next visit schedule must be in the format Y-m-d.',

            /**Create record information */
            'consultation.created_by.required' => 'Created by is required.',
            'consultation.created_by.integer' => 'Created by must be a valid number.',
            'consultation.created_by.exists' => 'Creator does not exist.',

            /**Family members array */
            'family_members.array' => 'Family members must be an array.',
            'family_members.*.name.required' => 'Family member name is required.',
            'family_members.*.name.string' => 'Family member name must be a string.',
            'family_members.*.age.required' => 'Family member age is required.',
            'family_members.*.age.integer' => 'Family member age must be a valid number.',
            'family_members.*.relationship.required' => 'Family member relationship is required.',
            'family_members.*.relationship.string' => 'Family member relationship must be a string.',
            'family_members.*.occupation.required' => 'Family member occupation is required.',
            'family_members.*.occupation.string' => 'Family member occupation must be a string.',
            'family_members.*.living_status.required' => 'Family member living status is required.',
            'family_members.*.living_status.integer' => 'Family member living status must be a valid number.',
            'family_members.*.note.required' => 'Family member note is required.',
            'family_members.*.note.string' => 'Family member note must be a string.',
            'family_members.*.created_by.required' => 'Family member creator is required.',
            'family_members.*.created_by.integer' => 'Family member creator must be a valid number.',
            'family_members.*.created_by.exists' => 'Family member creator does not exist.',
        ];
    }
}
