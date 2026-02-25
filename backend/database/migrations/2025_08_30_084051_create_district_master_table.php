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
    Schema::create('district_master', function (Blueprint $table) {
        $table->id();
        $table->string('district_name');    // English name
        $table->string('dist_name_hi');     // Hindi name
        $table->string('district_code');    // Numeric district code or string
        $table->timestamps();               // created_at, updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('district_master');
    }
};
