<?php

namespace Modules\FacilityUser\Controllers;

use App\Http\Controllers\Controller;
use Modules\FacilityUser\Repositories\FacilityUserRepository;


class FacilityUserController extends Controller
{
    protected $facilityUserRepository;

    public function __construct(FacilityUserRepository $facilityUserRepository)
    {
        $this->facilityUserRepository = $facilityUserRepository;
    }

    public function index()
    {
        $data = $this->facilityUserRepository->getAll();
        return response()->json($data);
    }
}
