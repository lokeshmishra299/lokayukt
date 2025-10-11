<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('district_master')->insert([
            ['id' => 1, 'district_code' => 132, 'dist_name_hi' => 'सहारनपुर', 'district_name' => 'Saharanpur'],
            ['id' => 2, 'district_code' => 133, 'dist_name_hi' => 'मुजफ्फर नगर', 'district_name' => 'Muzaffarnagar'],
            ['id' => 3, 'district_code' => 134, 'dist_name_hi' => 'बिजनौर', 'district_name' => 'Bijnor'],
            ['id' => 4, 'district_code' => 135, 'dist_name_hi' => 'मुरादाबाद', 'district_name' => 'Moradabad'],
            ['id' => 5, 'district_code' => 136, 'dist_name_hi' => 'रामपुर', 'district_name' => 'Rampur'],
            ['id' => 6, 'district_code' => 137, 'dist_name_hi' => 'अमरोहा', 'district_name' => 'Amroha'],
            ['id' => 7, 'district_code' => 138, 'dist_name_hi' => 'मेरठ', 'district_name' => 'Meerut'],
            ['id' => 8, 'district_code' => 139, 'dist_name_hi' => 'बागपत', 'district_name' => 'Baghpat'],
            ['id' => 9, 'district_code' => 140, 'dist_name_hi' => 'गाजियाबाद', 'district_name' => 'Ghaziabad'],
            ['id' => 10, 'district_code' => 141, 'dist_name_hi' => 'गौतम बुद्ध नगर', 'district_name' => 'Gautam Buddha Nagar'],
            ['id' => 11, 'district_code' => 142, 'dist_name_hi' => 'बुलन्दशहर', 'district_name' => 'BULANDSHAHR'],
            ['id' => 12, 'district_code' => 143, 'dist_name_hi' => 'अलीगढ़', 'district_name' => 'Aligarh'],
            ['id' => 13, 'district_code' => 144, 'dist_name_hi' => 'हाथरस', 'district_name' => 'Hathras'],
            ['id' => 14, 'district_code' => 145, 'dist_name_hi' => 'मथुरा', 'district_name' => 'Mathura'],
            ['id' => 15, 'district_code' => 146, 'dist_name_hi' => 'आगरा', 'district_name' => 'Agra'],
            ['id' => 16, 'district_code' => 147, 'dist_name_hi' => 'फ़िरोज़ाबाद', 'district_name' => 'Firozabad'],
            ['id' => 17, 'district_code' => 148, 'dist_name_hi' => 'मैनपुरी', 'district_name' => 'Mainpuri'],
            ['id' => 18, 'district_code' => 149, 'dist_name_hi' => 'बदायूं', 'district_name' => 'BUDAUN'],
            ['id' => 19, 'district_code' => 150, 'dist_name_hi' => 'बरेली', 'district_name' => 'Bareilly'],
            ['id' => 20, 'district_code' => 151, 'dist_name_hi' => 'पीलीभीत', 'district_name' => 'Pilibhit'],
            ['id' => 21, 'district_code' => 152, 'dist_name_hi' => 'शाहजहाँपुर', 'district_name' => 'Shahjahanpur'],
            ['id' => 22, 'district_code' => 153, 'dist_name_hi' => 'लखीमपुर खीरी', 'district_name' => 'Lakhimpur Kheri'],
            ['id' => 23, 'district_code' => 154, 'dist_name_hi' => 'सीतापुर', 'district_name' => 'Sitapur'],
            ['id' => 24, 'district_code' => 155, 'dist_name_hi' => 'हरदोई', 'district_name' => 'Hardoi'],
            ['id' => 25, 'district_code' => 156, 'dist_name_hi' => 'उन्नाव', 'district_name' => 'Unnao'],
            ['id' => 26, 'district_code' => 157, 'dist_name_hi' => 'लखनऊ', 'district_name' => 'Lucknow'],
            ['id' => 27, 'district_code' => 158, 'dist_name_hi' => 'रायबरेली', 'district_name' => 'RAE BARELI'],
            ['id' => 28, 'district_code' => 159, 'dist_name_hi' => 'फर्रूखाबाद', 'district_name' => 'Farrukhabad'],
            ['id' => 29, 'district_code' => 160, 'dist_name_hi' => 'कन्नौज', 'district_name' => 'Kannauj'],
            ['id' => 30, 'district_code' => 161, 'dist_name_hi' => 'इटावा', 'district_name' => 'Etawah'],
            ['id' => 31, 'district_code' => 162, 'dist_name_hi' => 'औरैया', 'district_name' => 'AURAIYA'],
            ['id' => 32, 'district_code' => 163, 'dist_name_hi' => 'कानपुर देहात', 'district_name' => 'KANPUR DEHAT'],
            ['id' => 33, 'district_code' => 164, 'dist_name_hi' => 'कानपुर शहर', 'district_name' => 'KANPUR NAGAR'],
            ['id' => 34, 'district_code' => 165, 'dist_name_hi' => 'जालौन', 'district_name' => 'Jalaun'],
            ['id' => 35, 'district_code' => 166, 'dist_name_hi' => 'झांसी', 'district_name' => 'Jhansi'],
            ['id' => 36, 'district_code' => 167, 'dist_name_hi' => 'ललितपुर', 'district_name' => 'Lalitpur'],
            ['id' => 37, 'district_code' => 168, 'dist_name_hi' => 'हमीरपुर', 'district_name' => 'Hamirpur'],
            ['id' => 38, 'district_code' => 169, 'dist_name_hi' => 'महोबा', 'district_name' => 'Mahoba'],
            ['id' => 39, 'district_code' => 170, 'dist_name_hi' => 'बाँदा', 'district_name' => 'Banda'],
            ['id' => 40, 'district_code' => 171, 'dist_name_hi' => 'चित्रकूट', 'district_name' => 'Chitrakoot'],
            ['id' => 41, 'district_code' => 172, 'dist_name_hi' => 'फतेहपुर', 'district_name' => 'Fatehpur'],
            ['id' => 42, 'district_code' => 173, 'dist_name_hi' => 'प्रतापगढ़', 'district_name' => 'Pratapgarh'],
            ['id' => 43, 'district_code' => 174, 'dist_name_hi' => 'कौशाम्बी', 'district_name' => 'KAUSHAMBI'],
            ['id' => 44, 'district_code' => 175, 'dist_name_hi' => 'प्रयागराज', 'district_name' => 'Prayagraj'],
            ['id' => 45, 'district_code' => 176, 'dist_name_hi' => 'बाराबंकी', 'district_name' => 'Barabanki'],
            ['id' => 46, 'district_code' => 177, 'dist_name_hi' => 'अयोध्या', 'district_name' => 'Ayodhya'],
            ['id' => 47, 'district_code' => 178, 'dist_name_hi' => 'अम्बेडकर नगर', 'district_name' => 'AMBEDKAR NAGAR'],
            ['id' => 48, 'district_code' => 179, 'dist_name_hi' => 'सुल्तानपुर', 'district_name' => 'Sultanpur'],
            ['id' => 49, 'district_code' => 180, 'dist_name_hi' => 'बहराइच', 'district_name' => 'BAHRAICH'],
            ['id' => 50, 'district_code' => 181, 'dist_name_hi' => 'श्रावस्ती', 'district_name' => 'Shravasti'],
            ['id' => 51, 'district_code' => 182, 'dist_name_hi' => 'बलरामपुर', 'district_name' => 'Balrampur'],
            ['id' => 52, 'district_code' => 183, 'dist_name_hi' => 'गोंडा', 'district_name' => 'Gonda'],
            ['id' => 53, 'district_code' => 184, 'dist_name_hi' => 'सिद्धार्थ नगर', 'district_name' => 'SIDDHARTH NAGAR'],
            ['id' => 54, 'district_code' => 185, 'dist_name_hi' => 'बस्ती', 'district_name' => 'Basti'],
            ['id' => 55, 'district_code' => 186, 'dist_name_hi' => 'संत कबीर नगर', 'district_name' => 'SANT KABEER NAGAR'],
            ['id' => 56, 'district_code' => 187, 'dist_name_hi' => 'महाराजगंज', 'district_name' => 'Maharajganj'],
            ['id' => 57, 'district_code' => 188, 'dist_name_hi' => 'गोरखपुर', 'district_name' => 'Gorakhpur'],
            ['id' => 58, 'district_code' => 189, 'dist_name_hi' => 'कुशी नगर', 'district_name' => 'KUSHI NAGAR'],
            ['id' => 59, 'district_code' => 190, 'dist_name_hi' => 'देवरिया', 'district_name' => 'Deoria'],
            ['id' => 60, 'district_code' => 191, 'dist_name_hi' => 'आजमगढ़', 'district_name' => 'Azamgarh'],
            ['id' => 61, 'district_code' => 192, 'dist_name_hi' => 'मऊ', 'district_name' => 'Mau'],
            ['id' => 62, 'district_code' => 193, 'dist_name_hi' => 'बलिया', 'district_name' => 'Ballia'],
            ['id' => 63, 'district_code' => 194, 'dist_name_hi' => 'जौनपुर', 'district_name' => 'Jaunpur'],
            ['id' => 64, 'district_code' => 195, 'dist_name_hi' => 'गाज़ीपुर', 'district_name' => 'Ghazipur'],
            ['id' => 65, 'district_code' => 196, 'dist_name_hi' => 'चंदौली', 'district_name' => 'Chandauli'],
            ['id' => 66, 'district_code' => 197, 'dist_name_hi' => 'वाराणसी', 'district_name' => 'Varanasi'],
            ['id' => 67, 'district_code' => 198, 'dist_name_hi' => 'भदोही', 'district_name' => 'Bhadohi'],
            ['id' => 68, 'district_code' => 199, 'dist_name_hi' => 'मिर्ज़ापुर', 'district_name' => 'Mirzapur'],
            ['id' => 69, 'district_code' => 200, 'dist_name_hi' => 'सोनभद्र', 'district_name' => 'Sonbhadra'],
            ['id' => 70, 'district_code' => 201, 'dist_name_hi' => 'एटा', 'district_name' => 'Etah'],
            ['id' => 71, 'district_code' => 202, 'dist_name_hi' => 'कासगंज', 'district_name' => 'Kasganj'],
            ['id' => 72, 'district_code' => 203, 'dist_name_hi' => 'अमेठी', 'district_name' => 'Amethi'],
            ['id' => 73, 'district_code' => 204, 'dist_name_hi' => 'हापुड़', 'district_name' => 'Hapur'],
            ['id' => 74, 'district_code' => 205, 'dist_name_hi' => 'सम्भल', 'district_name' => 'Sambhal'],
            ['id' => 75, 'district_code' => 206, 'dist_name_hi' => 'शामली', 'district_name' => 'Shamli'],
            ['id' => 76, 'district_code' => 207, 'dist_name_hi' => 'प्रयागराज(मेला)', 'district_name' => 'Prayagraj(mela)'],
        ]);
    }
}
