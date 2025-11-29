<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Role as ModelsRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,SoftDeletes;
    // use HasRoles;
    use HasApiTokens;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    
    protected $fillable = [
        'name', 'email', 'district_id','designation_id','department_id',
        'role_id','sub_role_id','password1','password','otp','number','user_name','deleted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

//     public function district()
//     {
//         return $this->belongsTo(District::class);
//     }

    public function department()
{
    return $this->belongsTo(Department::class, 'department_id', 'id');
}


//     public function tehsil()
// {
//     return $this->belongsTo(Tehsil::class, 'tehsil_id', 'tehsil_code');
// }
    

      public function designation()
    {
        return $this->belongsTo(Designation::class,'designation_id','id');
    }
    
// public function roles()
// {
//     return $this->belongsToMany(Role::class, 'model_has_roles', 'model_id', 'role_id');
// }

public function role() {
    return $this->belongsTo(Role::class);
}

public function subrole() {
    return $this->belongsTo(SubRole::class, 'sub_role_id','id');
}
// public function user()
// {
//     return $this->belongsTo(User::class, 'user_id');
// }


}
