<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
     protected $table = 'complaints'; 
    public $timestamps = false; 
    public function district()
{
    return $this->belongsTo(District::class,'district_code', 'district_id');
}

}
