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
       Schema::create('employee_complain_notes', function (Blueprint $table) {
            $table->id();

            $table->integer('employee_file_id');
            $table->integer('added_by')->nullable();
            $table->string('type', 250)->nullable();
            $table->text('description');
            $table->integer('d_id')->nullable();
            $table->integer('forward_by')->nullable();
            $table->integer('forward_to')->nullable();
            $table->integer('range_from')->nullable();
            $table->integer('range_two')->nullable();
            $table->integer('latitude')->nullable();
            $table->integer('longitude')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_complain_notes');
    }
};
