<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeUploadFiles extends Model
{
    protected $table = 'employee_files'; 
    public $timestamps = false; 
    protected $guarded = [];

    public function user() {
        return $this->belongsTo(User::class,'added_by','id');
    }
}
