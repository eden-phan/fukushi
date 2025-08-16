<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Check if roles already exist to avoid duplication
        if (Role::count() > 0) {
            return;
        }
        $admin = Role::firstOrCreate(['name' => 'admin']);

        $manager = Role::firstOrCreate(['name' => 'manager']);

        $staff = Role::firstOrCreate(['name' => 'staff']);
    }
}
