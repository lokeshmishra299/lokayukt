<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        DB::table('roles')->insert([
            ['name' => 'admin',         'label' => 'Administrator'],
            ['name' => 'op',            'label' => ' Operator'],
            ['name' => 'sv',             'label' => ' Supervisor'],
            ['name' => 'lok-ayukt',      'label' => 'Hon’ble LokAyukta'],
            ['name' => 'up-lok-ayukt',   'label' => 'Hon’ble UpLokAyukta'],
        ]);
    }
}
