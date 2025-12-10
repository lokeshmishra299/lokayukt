<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complainant extends Model
{
      protected $table = 'complainants'; 
    public $timestamps = false; 
   protected $fillable = [
        'complaint_id',
        'complainant_name',
        'father_name',
        'occupation',
        'is_public_servant',
        'permanent_place',
        'permanent_post_office',
        'permanent_district',
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
