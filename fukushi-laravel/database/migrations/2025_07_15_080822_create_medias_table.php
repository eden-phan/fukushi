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
        if (!Schema::hasTable('medias')) {
            Schema::create('medias', function (Blueprint $table) {
                $table->id();
                $table->string('filename')->nullable();
                $table->string('media_type')->nullable();
                $table->string('vendor')->nullable();
                $table->string('ext')->nullable();
                $table->text('path')->nullable();
                $table->string('s3_key')->nullable();
                $table->string('size')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medias');
    }
};
