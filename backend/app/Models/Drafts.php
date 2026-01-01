<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drafts extends Model
{
     protected $table = 'drafts';

    public $timestamps = false; 

    protected $fillable = [
        'complaint_id',
        'draft_note',
        'status'
       
    ];
}
