<?php

namespace Modules\InformationConsent\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Modules\InformationConsent\Repositories\InformationConsentRepository;
use Modules\InformationConsent\Request\CreateInformationConsent;

class InformationController extends Controller
{
    protected $informationConsentRepository;

    public function __construct(InformationConsentRepository $informationConsentRepository)
    {
        $this->informationConsentRepository = $informationConsentRepository;
    }

    public function create(CreateInformationConsent $request, $id)
    {
        $document = $this->informationConsentRepository->createInformationConsentById($request, $id);
        return ApiResponse::success($document);
    }

    public function index($id)
    {
        $document = $this->informationConsentRepository->getInformationConsentById($id);
        return ApiResponse::success($document);
    }

    public function update(CreateInformationConsent $request, $id)
    {
        $document = $this->informationConsentRepository->updateInformationConsentById($request,$id);
        return ApiResponse::success($document);
    }
}
