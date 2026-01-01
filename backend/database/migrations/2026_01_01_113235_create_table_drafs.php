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
        Schema::create('table_drafs', function (Blueprint $table) {
            $table->id();
            $table->integer('complaint_id');
            $table->string('draft_note', 500);
            $table->enum('status',['0','1'])->comment('0=Active, 1=Inactive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_drafs');
    }
};
