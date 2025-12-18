<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
     protected $table = 'dispach_letters';

    // protected $primaryKey = 'district_code'; 

    public $timestamps = false; 

    protected $fillable = [
        'complaint_id',
        'letter_type',
        'subject',
        'file',
      
    ];
}
