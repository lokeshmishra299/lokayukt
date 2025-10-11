<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('sub_roles')->insert([
            ['role_id' =>'2','name' => 'ro-aro',      'label' => 'RO/ARO'],
            ['role_id' =>'2','name' => 'entry-operator',      'label' => 'Entry Operator'],
            ['role_id' =>'2','name' => 'review-operator',      'label' => 'Review Operator'],
            ['role_id' =>'3','name' => 'so-us',      'label' => 'Section Officer / Under Secretary'],
            ['role_id' =>'3','name' => 'ds-js',      'label' => 'Deputy Secretary / Joint Secretary'],
            ['role_id' =>'3','name' => 'sec',      'label' => 'Secretary'],
            ['role_id' =>'3','name' => 'cio-io',      'label' => 'CIO / Investigation Officer'],
            ['role_id' =>'3','name' => 'dea-assis',      'label' => 'Dealing Assistant'],
        ]);
    }
}
