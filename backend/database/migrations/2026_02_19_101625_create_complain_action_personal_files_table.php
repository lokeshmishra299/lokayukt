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
        Schema::create('complain_action_personal_files', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('file_id');

            
            $table->unsignedBigInteger('forward_by_rk')->nullable();
            $table->unsignedBigInteger('forward_to_rk')->nullable();

            
            $table->unsignedBigInteger('forward_to_ro_aro')->nullable();
            $table->unsignedBigInteger('forward_by_ro_aro')->nullable();

           
            $table->unsignedBigInteger('forward_to_ps')->nullable();
            $table->unsignedBigInteger('forward_by_ps')->nullable();

            
            $table->unsignedBigInteger('forward_by_ro')->default(0);
            $table->unsignedBigInteger('forward_to_ro')->default(0);

           
            $table->unsignedBigInteger('forward_by_io')->default(0);
            $table->unsignedBigInteger('forward_to_io')->default(0);

            $table->unsignedBigInteger('forward_by_ds')->nullable();
            $table->unsignedBigInteger('forward_to_ds')->nullable();

            $table->string('subject', 250)->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('sent_through_rk')->nullable();
            $table->unsignedBigInteger('sent_through_rk_id')->nullable();
            $table->date('target_date')->nullable();

            $table->unsignedBigInteger('forward_to_js')->nullable();
            $table->unsignedBigInteger('forward_by_js')->nullable();
            $table->unsignedBigInteger('forward_to_sec')->nullable();
            $table->unsignedBigInteger('forward_by_sec')->nullable();
            $table->unsignedBigInteger('forward_to_dispatch')->default(0);
            $table->unsignedBigInteger('forward_to_cio_io')->nullable();
            $table->unsignedBigInteger('forward_by_cio_io')->nullable();
            $table->unsignedBigInteger('forward_to_us')->nullable();
            $table->unsignedBigInteger('forward_by_us')->nullable();

            $table->integer('status_so_us')->default(0);
            $table->integer('status_ds_js')->default(0);
            $table->integer('status_sec')->default(0);
            $table->integer('status_cio')->default(0);
            $table->integer('status_d_a')->default(0);
            $table->integer('status_lokayukt')->default(0);
            $table->integer('status_uplokayukt')->default(0);

            $table->unsignedBigInteger('forward_to_lokayukt')->default(0);
            $table->unsignedBigInteger('forward_to_uplokayukt')->default(0);
            $table->unsignedBigInteger('forward_by_lokayukt')->default(0);
            $table->unsignedBigInteger('forward_by_uplokayukt')->nullable();

            $table->integer('type')->nullable();

            $table->enum('status', ['Verified', 'Forwarded', 'Report Requested', 'Pending'])->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complain_action_personal_files');
    }
};
