<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintSupporting extends Model
{
     protected $table = 'complaint_supporting'; 
    public $timestamps = false; 

     protected $fillable = [
        'complaint_id',
        'support_name',
        'support_address',
       
    ];
}
