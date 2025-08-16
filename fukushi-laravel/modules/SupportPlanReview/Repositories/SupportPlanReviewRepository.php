<?php

use Modules\Core\Repositories\BaseRepository;
use Modules\SupportPlanReview\Models\SupportPlanReview;

class SupportPlanReviewRepository extends BaseRepository{
        protected $model;

    public function __construct(SupportPlanReview $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return SupportPlanReview::class;
    }

    public function getAll()
    {
        return $this->model;
    }
}