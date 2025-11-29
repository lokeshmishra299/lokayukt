<?php

namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function departments(Request $request)
    {

        // dd($request->all());

        $validation = Validator::make($request->all(), [

            'department_name' => 'required|string',
            'department_hindi' => 'nullable',

        ]);

        if ($validation->fails()) {
            return ApiResponse::generateResponse(
                false,
                'Validation Error',
                $validation->errors(),
                422
            );
        }

        $department = new Department();

        $department->name = $request->department_name;
        $department->name_hindi = $request->department_hindi;
        $department->status = '1';
        $department->save();

        return ApiResponse::generateResponse(true, 'Department saved successfully', $department, 200);
    }

    public function departments_edit(Request $request, $id)
    {



        // dd($department);


        $validation = Validator::make($request->all(), [

            'department_name' => 'required|string',
            'department_hindi' => 'nullable',

        ]);

        if ($validation->fails()) {
            return ApiResponse::generateResponse(
                false,
                'Validation Error',
                $validation->errors(),
                422
            );
        }
        $department = Department::find($id);

        $department->name = $request->department_name;
        $department->name_hindi = $request->department_hindi;
        $department->status = '1';
        $department->save();

        return ApiResponse::generateResponse(true, 'Department updated successfully', $department, 200);
    }

   public function department_delete($id)
{
    $department = Department::find($id);

    if (!$department) {
        return ApiResponse::generateResponse(
            false,
            'Department not found.',
            null,
            404
        );
    }

    $department->delete();

    return ApiResponse::generateResponse(
        true,
        'Department deleted successfully.',
        null,
        200
    );
}

}
