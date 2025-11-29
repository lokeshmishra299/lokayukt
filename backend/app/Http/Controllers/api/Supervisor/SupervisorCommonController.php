<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ComplainType;
use App\Models\Department;
use App\Models\Designation;
use App\Models\District;
use App\Models\RejectionReasons;
use App\Models\Role;
use App\Models\Subjects;
use App\Models\SubRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupervisorCommonController extends Controller
{
    public function fetch_district(){

        $district=District::orderBy('district_name', 'asc')->get();
        // dd($district->toArray());
        return ApiResponse::generateResponse('success','District fetch successfully',$district);
    }
    public function fetch_designation(){

        $designation = Designation::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Designation fetch successfully',$designation);
    }
       public function fetch_department(){

        $department = Department::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Department fetch successfully',$department);
    }
    public function fetch_subject(){

        $designation = Subjects::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Subject fetch successfully',$designation);
    }
    
    public function fetch_complainstype(){

        $designation = ComplainType::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Complain Type fetch successfully',$designation);
    }
    public function fetch_rejection(){

        $designation = RejectionReasons::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Rejection Reasons fetch successfully',$designation);
    }

    

       public function addDistrict(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'district_name' => 'required|string|max:150',
            'dist_name_hi' => 'required|string|max:150',
            'district_code' => 'required',
         
          
        ], [
            'district_name.required' => 'District Name is required.',
            'dist_name_hi.required' => 'Distric Name in Hindi is required.',
            'district_code.required' => 'District code is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $district = new District();
        $district->district_name = $request->district_name;
        $district->dist_name_hi= $request->dist_name_hi;
        $district->district_code= $request->district_code;
        
    
        $district->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'District added successfully.',
            'data' => $district
        ], 201);
    }
     public function editDistrict(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'district_name' => 'required|string|max:150',
            'dist_name_hi' => 'required|string|max:150',
            'district_code' => 'required',
         
          
        ], [
           'district_name.required' => 'District Name is required.',
            'dist_name_hi.required' => 'Distric Name in Hindi is required.',
            'district_code.required' => 'District code is required.',
           
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $district = District::find($id);

         if(!$district){
            return response()->json([
                'status' => false,
                'message' => 'Invalid district ID.',
            ], 400);

        }

        $district->district_name = $request->district_name;
        $district->dist_name_hi= $request->dist_name_hi;
        $district->district_code= $request->district_code;
        $district->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'District update successfully.',
            'data' => $district
        ], 200);
    }

    public function removeDistrict(Request $request,$id)
     {
        $id = $request->id;
        $district = District::find($id);
        if (!$district) {
            return response()->json([
                'status' => false,
                'message' => 'District not found.'
            ], 404);
        }
        if($district->delete()){

    return response()->json([
                'status' => true,
                'message' => 'District deleted successfully.'
            ], 200);
        }
    }

    public function addDepartment(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_hindi' => 'required|string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_hindi.required' => 'Name in Hindi is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $department = new Department();
        $department->name = $request->name;
        $department->name_hindi= $request->name_hindi;
        $department->status = 1;
    
        $department->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Department added successfully.',
            'data' => $department
        ], 201);
    }
     public function editDepartment(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_hindi' => 'required|string|max:150',
         
          
        ], [
             'name.required' => 'Name is required.',
            'name_hindi.required' => 'Name in Hindi is required.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $department = Department::find($id);

         if(!$department){
            return response()->json([
                'status' => false,
                'message' => 'Invalid department ID.'
            ], 400);

        }

        $department->name = $request->name;
        $department->name_hindi = $request->name_hindi;
        $department->status = 1;
    
        $department->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Department update successfully.',
            'data' => $department
        ], 200);
    }

      public function removeDepartment(Request $request,$id)
      {
        $id = $request->id;
        $department = Department::find($id);
        if (!$department) {
            return response()->json([
                'status' => false,
                'message' => 'Department not found.'
            ], 404);
        }
        if($department->delete()){

            return response()->json([
                        'status' => true,
                        'message' => 'Department deleted successfully.'
                    ], 200);
        }
    }

     public function addDesignation(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $designation = new Designation();
        $designation->name = $request->name;
        $designation->name_h = $request->name_h;
        $designation->status = 1;
    
        $designation->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Designation added successfully.',
            'data' => $designation
        ], 201);
    }
     public function editDesignation(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
         
          
        ], [
             'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $designation = Designation::find($id);

         if(!$designation){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $designation->name = $request->name;
        $designation->name_h = $request->name_h;
        $designation->status = 1;
    
        $designation->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Designation update successfully.',
            'data' => $designation
        ], 200);
    }

    
    public function removeDesignation(Request $request,$id)
    {
        $id = $request->id;
        $designation = Designation::find($id);
        if (!$designation) {
            return response()->json([
                'status' => false,
                'message' => 'Designation not found.'
            ], 404);
        }
        if($designation->delete()){

    return response()->json([
                'status' => true,
                'message' => 'Designation deleted successfully.'
            ], 200);
        }
    }

     public function addSubject(Request $request)
    {

        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $subject = new Subjects();
        $subject->name = $request->name;
        $subject->name_h = $request->name_h;
        $subject->status = 1;
    
        $subject->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Subject added successfully.',
            'data' => $subject
        ], 201);
    }
     public function editSubject(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $subject = Subjects::find($id);

         if(!$subject){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $subject->name = $request->name;
        $subject->name_h = $request->name_h;
        $subject->status = 1;
    
        $subject->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Subject update successfully.',
            'data' => $subject
        ], 200);
    }

        public function removeSubject(Request $request,$id)
         {
        $id = $request->id;
        $subject = Subjects::find($id);
        if (!$subject) {
            return response()->json([
                'status' => false,
                'message' => 'Subject not found.'
            ], 404);
        }
        if($subject->delete()){

    return response()->json([
                'status' => true,
                'message' => 'Subject deleted successfully.'
            ], 200);
        }
    }

        public function addComplainType(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
            'name.description' => 'Description is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $complainType = new ComplainType();
        $complainType->name = $request->name;
        $complainType->name_h = $request->name_h;
        $complainType->status = 1;
        $complainType->description = $request->description;
    
        $complainType->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'ComplainType added successfully.',
            'data' => $complainType
        ], 201);
    }
     public function editComplainType(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
             'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
            'discription.required' => 'Discription is required.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $complaintype = ComplainType::find($id);

         if(!$complaintype){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $complaintype->name = $request->name;
        $complaintype->name_h = $request->name_h;
        $complaintype->status = 1;
        $complaintype->description = $request->description;
    
        $complaintype->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'ComplainType update successfully.',
            'data' => $complaintype
        ], 200);
    }

    public function removeComplainType(Request $request,$id)
     {
        $id = $request->id;
        $complainType = ComplainType::find($id);
        if (!$complainType) {
            return response()->json([
                'status' => false,
                'message' => 'ComplainType not found.'
            ], 404);
        }
        if($complainType->delete()){

    return response()->json([
                'status' => true,
                'message' => 'ComplainType deleted successfully.'
            ], 200);
        }
    }

         public function addRejection(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
            'name.description' => 'Description is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $rejection = new RejectionReasons();
        $rejection->name = $request->name;
        $rejection->name_h = $request->name_h;
        $rejection->status = 1;
        $rejection->description = $request->description;
    
        $rejection->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Rejection Reason added successfully.',
            'data' => $rejection
        ], 201);
    }
     public function editRejection(Request $request,$id)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'required|string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name_h.required' => 'Name in Hindi is required.',
            'discription.required' => 'Discription is required.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $rejectionReason = RejectionReasons::find($id);

         if(!$rejectionReason){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $rejectionReason->name = $request->name;
        $rejectionReason->name_h = $request->name_h;
        $rejectionReason->status = 1;
        $rejectionReason->description = $request->description;
    
        $rejectionReason->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Rejection Reason update successfully.',
            'data' => $rejectionReason
        ], 200);
    }

    public function removeRejection(Request $request,$id)
     {
        $id = $request->id;
        $rejection = RejectionReasons::find($id);
        if (!$rejection) {
            return response()->json([
                'status' => false,
                'message' => 'Rejection not found.'
            ], 404);
        }
        if($rejection->delete()){

    return response()->json([
                'status' => true,
                'message' => 'Rejection deleted successfully.'
            ], 200);
        }
    }

    public function getRoles(){
        $role = Role::get();
             return response()->json([
                'status' => true,
                'message' => 'Role fetch successfully.',
                'role' => $role
            ], 200);
        
    }
    public function getSubroles(Request $request,$roleId){
        $subroles = SubRole::where('role_id',$roleId)->get();
        // dd($subroles);
        if($subroles){
            
            return response()->json([
                  'status' => true,
                  'message' => 'Subrole fetch successfully.',
                  'subrole' => $subroles
              ], 200);
        }else{
                 return response()->json([
                'status' => false,
                'message' => 'SubRole not found.'
            ], 404);
        }
        
    }
}