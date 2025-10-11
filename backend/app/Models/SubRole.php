<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubRole extends Model
{
    protected $table = 'sub_roles'; 
    //  protected $fillable = [
    //     'name',
    //     'label',
    // ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
