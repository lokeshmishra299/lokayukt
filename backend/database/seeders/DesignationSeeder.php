<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            DB::table('designations')->insert([
            ['name' => 'Collector','name_h' => 'कलेक्टर', 'status' => '1'],
            ['name' => 'SDM','name_h' => 'एसडीएम', 'status' => '1'],
            ['name' => 'Tehsildar','name_h' => 'तहसीलदार', 'status' => '1'],
            ['name' => 'BDO','name_h' => '	बीडीओ', 'status' => '1'],
            ['name' => 'Executive Engineer','name_h' => 'कार्यपालन अभियंता', 'status' => '1'],
           
        ]);
    }
}
