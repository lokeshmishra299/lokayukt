<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComplaintRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
  public function rules()
    {
        return [

            'relation_with_person'        => 'nullable|string|max:500',
            'authorization_document'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',

            'permanent_name'              => 'nullable|string|max:255',
            'permanent_place'             => 'nullable|string|max:255',
            'permanent_post_office'       => 'nullable|string|max:255',
            'permanent_district'          => 'nullable|string|max:255',

            'correspondence_name'         => 'nullable|string|max:255',
            'correspondence_place'        => 'nullable|string|max:255',
            'correspondence_post_office'  => 'nullable|string|max:255',
            'correspondence_district'     => 'nullable|string|max:255',

            'cause_date'                  => 'nullable|date',
            'delay_reason'                => 'nullable|string',
            'previously_submitted'        => 'nullable|in:yes,no',
            'previously_submitted_details'=> 'nullable|string',

            'category'                    => 'nullable|in:assertion,complaint',

            'challan_number'              => 'nullable|string|max:255',
            'challan_date'                => 'nullable|date',
            'challan_file'                => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',

            'supporting_affidavit_list'   => 'nullable|string',
            'other_witnesses'             => 'nullable|string',
            'attached_documents'          => 'nullable|string',
            'complaint_description'       => 'nullable|string',
            'complainant_id'              => 'nullable|array',
            'complainant_id.*'            => 'nullable|integer|exists:complainants,id',

            'complainant_name'            => 'required|array',
            'complainant_name.*'          => 'required|string|max:255',

            'father_name.*'               => 'nullable|string|max:255',
            'occupation.*'                => 'nullable|string|max:255',
            'is_public_servant.*'         => 'nullable|in:yes,no',
            'respondent_id'               => 'nullable|array',
            'respondent_id.*'             => 'nullable|integer|exists:respondents,id',

            'respondent_name'             => 'required|array',
            'respondent_name.*'           => 'required|string|max:255',

            'designation.*'               => 'nullable|string|max:255',
            'current_address.*'           => 'nullable|string',
        ];
    }
}
