<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [

            /*----------------------------------------------------
            | SECTION 1 — Main Complaint (Required)
            ----------------------------------------------------*/
            'relation_with_person'        => 'required|string|max:500',
            'authorization_document'      => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',

            // Permanent Address
            // 'permanent_name'              => 'required|string|max:255',
            'permanent_place'             => 'required|string|max:255',
            'permanent_post_office'       => 'required|string|max:255',
            'permanent_district'          => 'required|string|max:255',

            // Correspondence Address
            'correspondence_name'         => 'required|string|max:255',
            'correspondence_place'        => 'required|string|max:255',
            'correspondence_post_office'  => 'required|string|max:255',
            'correspondence_district'     => 'required|string|max:255',


            /*----------------------------------------------------
            | SECTION 6
            ----------------------------------------------------*/
            'cause_date'                  => 'required|date',
            'delay_reason'                => 'required|string',

            'previously_submitted'        => 'required|in:yes,no',
            'previously_submitted_details'=> 'required_if:previously_submitted,yes|string',


            /*----------------------------------------------------
            | SECTION 7
            ----------------------------------------------------*/
            'category'                    => 'required|in:assertion,complaint',


            /*----------------------------------------------------
            | SECTION 8 — Challan (Required)
            ----------------------------------------------------*/
            'challan_number'              => 'string|max:255',
            'challan_date'                => 'date',
            'challan_file'                => 'file|mimes:pdf,jpg,jpeg,png|max:2048',


            /*----------------------------------------------------
            | SECTION 9–12
            ----------------------------------------------------*/
            'support_name'   => 'required|string',
            'support_address'   => 'required|string',
            'witness_name'             => 'required|string',
            'witness_address'             => 'required|string|250',
            'attached_documents'          => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'complaint_description'       => 'required|string',


            /*----------------------------------------------------
            | MULTIPLE COMPLAINANTS (Required)
            ----------------------------------------------------*/

             'support_name'   => 'required|string',
             'support_name.*'   => 'required|string|max:150',
             'support_address'   => 'required|string',
             'support_address.*'   => 'required|string|max:255',

            'witness_name'             => 'required|string',
             'witness_name.*'          => 'required|string|max:150',
            
            'witness_address'             => 'required|string|250',
            'witness_address.*'          => 'required|string|max:255',

            'complainant_name'            => 'required|array|min:1',
            'complainant_name.*'          => 'required|string|max:255',

            'father_name'                 => 'required|array|min:1',
            'father_name.*'               => 'required|string|max:255',

            'occupation'                  => 'required|array|min:1',
            'occupation.*'                => 'required|string|max:255',

            'is_public_servant'           => 'required|array|min:1',
            'is_public_servant.*'         => 'required|in:yes,no',


            /*----------------------------------------------------
            | MULTIPLE RESPONDENTS (Required)
            ----------------------------------------------------*/
            'respondent_name'             => 'required|array|min:1',
            'respondent_name.*'           => 'required|string|max:255',

            'designation'                 => 'required|array|min:1',
            'designation.*'               => 'required|string|max:255',

            'current_address'             => 'required|array|min:1',
            'current_address.*'           => 'required|string',
        ];
    }



    public function messages()
    {
        return [

            /* -----------------------------------------
            | Main Complaint
            ----------------------------------------- */
            'relation_with_person.required' => 'Relation with person is required.',
            'authorization_document.required' => 'Authorization document is required.',
            'authorization_document.mimes' => 'Authorization document must be a PDF or image.',
            'authorization_document.max' => 'Authorization document size cannot exceed 2MB.',

            'permanent_name.required' => 'Permanent address name is required.',
            'permanent_place.required' => 'Permanent address place is required.',
            'permanent_post_office.required' => 'Permanent post office is required.',
            'permanent_district.required' => 'Permanent district is required.',

            'correspondence_name.required' => 'Correspondence name is required.',
            'correspondence_place.required' => 'Correspondence place is required.',
            'correspondence_post_office.required' => 'Correspondence post office is required.',
            'correspondence_district.required' => 'Correspondence district is required.',


            /* -----------------------------------------
            | Section 6
            ----------------------------------------- */
            'cause_date.required' => 'Cause date is required.',
            'delay_reason.required' => 'Delay reason is required.',
            'previously_submitted.required' => 'Please select Yes/No.',
            'previously_submitted_details.required_if' => 'Details required if previously submitted.',


            /* -----------------------------------------
            | Section 7
            ----------------------------------------- */
            'category.required' => 'Category is required.',
            'category.in' => 'Category must be assertion or complaint.',


            /* -----------------------------------------
            | Challan
            ----------------------------------------- */
            'challan_number.required' => 'Challan number is required.',
            'challan_date.required' => 'Challan date is required.',
            'challan_file.required' => 'Challan file is required.',
            'challan_file.mimes' => 'Challan file must be a PDF or image.',
            'challan_file.max' => 'Challan file size cannot exceed 2MB.',


            /* -----------------------------------------
            | Section 9–12
            ----------------------------------------- */
            'supporting_affidavit_list.required' => 'Supporting affidavit list required.',
            'other_witnesses.required' => 'Other witnesses detail required.',
            'attached_documents.required' => 'Attached documents detail required.',
            'complaint_description.required' => 'Complaint description is required.',


            /* -----------------------------------------
            | Complainants
            ----------------------------------------- */
            'complainant_name.required' => 'At least one complainant is required.',
            'complainant_name.*.required' => 'Complainant name is required.',

            'father_name.*.required' => 'Father name is required.',
            'occupation.*.required' => 'Occupation is required.',
            'is_public_servant.*.required' => 'Public servant Yes/No is required.',


            /* -----------------------------------------
            | Respondents
            ----------------------------------------- */
            'respondent_name.required' => 'At least one respondent is required.',
            'respondent_name.*.required' => 'Respondent name is required.',

            'designation.*.required' => 'Respondent designation is required.',
            'current_address.*.required' => 'Current address is required.',
        ];
    }
}
