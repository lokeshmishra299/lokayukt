<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respondent extends Model
{
     protected $fillable = [
        'complaint_id',
        'respondent_name',
        'designation',
        'current_address'
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
