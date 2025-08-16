<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware('auth:api')->prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/staff', [UserController::class, 'getAllStaff']);
});

require base_path('modules/Auth/routes.php');
require base_path('modules/Profile/Routes/api.php');
require base_path('modules/SessionRecord/Routes/api.php');
require base_path('modules/Facility/Routes/api.php');
require base_path('modules/FacilityUser/Routes/api.php');
require base_path('modules/Consultation/Routes/api.php');
require base_path('modules/Document/Routes/api.php');
require base_path('modules/ServiceUser/Routes/api.php');
require base_path('modules/Deposit/Routes/api.php');
require base_path('modules/Media/Routes/api.php');
require base_path('modules/FamilyMember/Routes/api.php');
require base_path('modules/SupportPlan/Routes/api.php');
require base_path('modules/DocumentConfidentiality/Routes/api.php');
require base_path('modules/Manager/Routes/api.php');
require base_path('modules/InformationConsent/Routes/api.php');
require base_path('modules/Incident/Routes/api.php');
require base_path('modules/ServiceProvisionLog/Routes/api.php');
require base_path('modules/Assessments/Routes/api.php');
require base_path('modules/DailyReport/Routes/api.php');