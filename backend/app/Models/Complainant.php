<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complainant extends Model
{
   protected $fillable = [
        'complaint_id',
        'complainant_name',
        'father_name',
        'occupation',
        'is_public_servant'
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
