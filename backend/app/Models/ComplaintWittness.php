<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintWittness extends Model
{
      protected $table = 'complaint_witness'; 
    public $timestamps = false; 
       protected $fillable = [
        'complaint_id',
        'witness_name',
        'witness_address',
       
    ];
}
