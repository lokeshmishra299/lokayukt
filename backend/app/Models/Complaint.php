<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
     protected $table = 'complaints'; 
    // public $timestamps = true; 
 
//     public function district()
// {
//     return $this->belongsTo(District::class,'district_code', 'district_id');
// }

    protected $fillable = [
        'relation_with_person',
        'authorization_document',
        'permanent_name', 'permanent_place',
        'permanent_post_office', 'permanent_district',

        'correspondence_name', 'correspondence_place',
        'correspondence_post_office', 'correspondence_district',

        'cause_date', 'delay_reason',
        'previously_submitted', 'previously_submitted_details',

        'category',
        'challan_number', 'challan_date', 'challan_file',

        'supporting_affidavit_list',
        'other_witnesses',
        'attached_documents',
        'complaint_description'
    ];

    public function complainants()
    {
        return $this->hasMany(Complainant::class);
    }

    public function respondents()
    {
        return $this->hasMany(Respondent::class);
    }

}
