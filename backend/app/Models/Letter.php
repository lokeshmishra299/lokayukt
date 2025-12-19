<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
     protected $table = 'dispach_letters';

    public $timestamps = false; 

    protected $fillable = [
        'complaint_id',
        'letter_type',
        'subject',
        'file',
        'letter_no'
      
    ];
}
