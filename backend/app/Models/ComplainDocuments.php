<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplainDocuments extends Model
{
    protected $table = 'complaints_documents'; 
    public $timestamps = false; 
     protected $fillable = [
         'complain_id',
         'file',
     ];
}
