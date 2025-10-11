<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class UserManagement extends Controller
{
    public function index()
    {
        $users = User::with('role:id,name','department:id,name')->get();
        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }

    public function user_management(Request $request)
    {
        // Validate input
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            // 'designation'  => 'required|exists:designations,id',
            // 'department'   => 'required|exists:departments,id',
            'district_id'  => 'required|exists:district_master,district_code',
        ], [

            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
             'district_id.required'     => 'Please select a district.',
            'district_id.exists'       => 'Selected district does not exist.',
            //  'department.required'     => 'Please select a department.',
            // 'department.exists'       => 'Selected department does not exist.',
            // 'designation.required'     => 'Please select a designation.',
            // 'designation.exists'       => 'Selected designation does not exist.',
             'number.required'         => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',

        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }


        $baseUserName = str::slug($request->name);
        $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
        $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';

        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'number'       => $request->number,
            'role_id'      => $request->role_id,
            'sub_role_id'      => $request->sub_role_id,
            'district_id'  => $request->district_id,
            'designation_id'  => $request->designation,
            'department_id'   => $request->department,
            'user_name'    => $userName,
            'password1'    => $request->password,
            'password'     => bcrypt('password123'),
        ]);
        // dd($user);

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user->only([
                'id',
                'name',
                'email',
                'number',
                'role_id',
                'designation',
                'department',
                'user_name'
            ])
        ]);
    }

    public function editUser(Request $request,$id)
    {
        $user = User::findorfail($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }
    public function updateUser(Request $request,$id)
    {   
         $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            'designation'  => 'nullable|string|max:230',
            'department'   => 'nullable|string|max:200',
            'district_id'  => 'required|exists:district_master,district_code',
        ], [

            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
            'district_id.required'     => 'Please select a district.',
            'district_id.exists'       => 'Selected district does not exist.',
             'number.required'         => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',

        ]);

        //  'name'         => $request->name,
        //     'email'        => $request->email,
        //     'number'       => $request->number,
        //     'role_id'      => $request->role_id,
        //     'district_id'  => $request->district_id,
        //     'designation_id'  => $request->designation,
        //     'department_id'   => $request->department,
        //     'user_name'    => $userName,
        //     // 'password1'    => $request->password,
        //     'password'     => bcrypt($request->password),

       

        $user = User::findorfail($id);

         if($user->isDirty($request->name)){
              $baseUserName = str::slug($request->name);
                $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
                $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';
                $user->user_name     = $userName;
            }
       
            $user->name          = $request->name;       
            $user->email         = $request->email;
            $user->role_id       = $request->role_id;
            $user->sub_role_id   = $request->sub_role_id;
            $user->number        = $request->number;
            $user->district_id   = $request->district_id;
            $user->department_id = $request->department;
            $user->designation_id = $request->designation;

          if ($request->filled('password')) {
            $user->password = bcrypt($request->password); // always hash passwords!
           }
           

            $user->save();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function changeStatus(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        // $user->status = "1" ? "0" : "1";
        $user->status = ($user->status == "1") ? "0" : "1";
        $user->save();
        return response()->json([
            'status' => true,
            'message' => 'User status updated successfully',
            'data' => $user
        ]);
    }
}
