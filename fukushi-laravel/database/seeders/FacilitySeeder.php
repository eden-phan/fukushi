<?php

namespace Database\Seeders;

use Modules\Facility\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    public function run()
    {
        // Check if facilities already exist to avoid duplication
        if (Facility::count() > 0) {
            return;
        }

        $facility1 = Facility::create([
            'name' => '就労継続支援A型',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => '就労継続支援A型',
        ]);

        $facility2 = Facility::create([
            'name' => '就労継続支援B型',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => '就労継続支援B型',
        ]);

        $facility3 = Facility::create([
            'name' => 'グループホーム',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => 'グループホーム',
        ]);

        $facility4 = Facility::create([
            'name' => 'ショートステイ',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => 'ショートステイ',
        ]);

        $facility5 = Facility::create([
            'name' => '児童発達支援事業所',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => '児童発達支援事業所',
        ]);

        $facility6 = Facility::create([
            'name' => '放課後等デイサービス',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => '放課後等デイサービス',
        ]);

        $facility7 = Facility::create([
            'name' => '相談支援事業所',
            'service_type' => '',
            'facility_type' => '',
            'postal_code' => '',
            'prefecture' => '',
            'district' => '',
            'address' => '',
            'status' => 1,
            'description' => '相談支援事業所',
        ]);
    }
}
