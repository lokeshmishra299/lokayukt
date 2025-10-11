<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('mobile', 15);
            $table->string('address');
            $table->foreignId('district_id');
            $table->string('email')->unique();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('challan_no')->nullable();
            $table->date('dob')->nullable();

            $table->boolean('fee_exempted')->default(false)->comment('false=Fee exempted, true=Fee not exempted');

            
            $table->enum('department', [
                'lok_nirman',
                'education',
                'health',
                'police',
            ])->comment('Department handling the complaint');

          
            $table->string('officer_name');
            $table->enum('designation', [
                'collector',
                'ceo',
                'engineer',
            ])->comment('Officer designation');

            
            $table->enum('category', [
                'class_1',
                'class_2',
            ])->comment('Complaint category');

           
            $table->enum('subject', [
                'corruption',
                'delay_in_work',
                'misbehavior',
                'rule_violation',
            ])->comment('Nature of complaint subject');

           
            $table->enum('nature', [
                'allegation',
                'grievance',
            ])->comment('Complaint type');

            $table->text('description');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};