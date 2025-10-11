<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('subjects')->insert([
            ['name' => 'Corruption','name_h' => 'भ्रष्टाचार', 'status' => '1'],
            ['name' => 'Misuse of Power','name_h' => 'शक्ति का दुरुपयोग', 'status' => '1'],
            ['name' => 'Delay in Work','name_h' => 'कार्य में देरी', 'status' => '1'],
            ['name' => 'Wrong Information','name_h' => 'गलत जानकारी', 'status' => '1'],
            ['name' => 'Procedural Issues','name_h' => 'प्रक्रियागत समस्याएं', 'status' => '1']
     ]);
        }
}
