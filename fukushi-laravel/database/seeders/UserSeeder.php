<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Modules\Profile\Models\Profile;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Check if users already exist to avoid duplication
        if (User::count() > 0) {
            return;
        }

        /** Create user */
        $admin = User::create([
            'email' => 'admin@gmail.com',
            'password' => Hash::make('Admin@123'),
        ]);

        $admin->assignRole('admin');

        $manager = User::create([
            'email' => 'manager@gmail.com',
            'password' => Hash::make('Admin@123'),
        ]);

        $manager->assignRole('manager');

        $staff = User::create([
            'email' => 'staff@gmail.com',
            'password' => Hash::make('Admin@123'),
        ]);

        $staff->assignRole('staff');

        /** Create profile */
        Profile::create([
            'user_id' => $admin->id,
            'fullname' => 'Admin Nguyen',
            'user_type' => 'user',
        ]);

        Profile::create([
            'user_id' => $manager->id,
            'fullname' => 'Manager Nguyen',
            'user_type' => 'user',
        ]);

        Profile::create([
            'user_id' => $staff->id,
            'fullname' => 'Staff Nguyen',
            'user_type' => 'user',
        ]);
    }
}
