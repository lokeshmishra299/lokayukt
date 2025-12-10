<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respondent extends Model
{
     protected $fillable = [
        'complaint_id',
        'respondent_name',
        'designation',
        'current_address',
        'respondent_district',
        'officer_category',
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
