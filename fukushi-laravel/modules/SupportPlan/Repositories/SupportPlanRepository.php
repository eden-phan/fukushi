<?php

namespace Modules\SupportPlan\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\SupportPlan\Models\SupportPlan;
use Modules\SupportPlan\Models\SupportPlanDetail;
use Modules\SupportPlan\Models\SupportPlanGoal;

class SupportPlanRepository extends BaseRepository
{
    protected $model;
    protected $supportPlanGoal;
    protected $supportPlanDetail;


    public function __construct(
        SupportPlan $model,
        SupportPlanGoal $supportPlanGoal,
        SupportPlanDetail $supportPlanDetail
    ) {
        $this->model = $model;
        $this->supportPlanGoal = $supportPlanGoal;
        $this->supportPlanDetail = $supportPlanDetail;
    }

    public function getModel()
    {
        return SupportPlan::class;
    }

    public function getListSupportPlanById($id, $perPage = 10, $page = 1, $year = null)
    {
        $query = $this->model->with('serviceUser.profile')
            ->where('service_user_id', $id)
            ->orderBy('created_at', 'desc');

        if ($year) {
            $query->whereYear('created_at', $year);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function createSupportPlanByPatientId($id, $data)
    {
        $supportPlan = $this->model->create([
            'service_user_id' => $id,
            'staff_id' => $data['staff_id'],
            'status' => $data['status'],
            'is_assessed' => $data['is_assessed'],
            'user_family_intention' => $data['user_family_intention'],
            'yearly_support_goal' => $data['yearly_support_goal'],
        ]);

        $domains = [
            'community_life',
            'daily_life',
            'health',
            'leisure',
            'other_support'
        ];

        foreach ($domains as $domain) {
            if (!empty($data[$domain])) {
                $goalData = $data[$domain];
                $supportCategories = is_array($goalData['support_category']) ? json_encode($goalData['support_category']) : $goalData['support_category'];

                $this->supportPlanGoal::create([
                    'support_plan_id'      => $supportPlan->id,
                    'domain'               => $domain,
                    'support_category'     => $supportCategories,
                    'goal'                 => $goalData['goal'] ?? null,
                    'support_content'      => $goalData['support_content'] ?? null,
                    'progress_first_term'  => $goalData['progress_first_term'] ?? null,
                    'progress_second_term' => $goalData['progress_second_term'] ?? null,
                ]);
            }
        }

        if (!empty($data['support_details']) && is_array($data['support_details'])) {
            foreach ($data['support_details'] as $detail) {
                if (!empty($detail['item']) || !empty($detail['detail'])) {
                    $this->supportPlanDetail::create([
                        'support_plan_id' => $supportPlan->id,
                        'activity_time'   => $detail['time'] ?? null,
                        'activity_name'   => $detail['item'] ?? null,
                        'description'     => $detail['detail'] ?? null,
                        'created_by'      => $data['staff_id'] ?? null,
                    ]);
                }
            }
        }

        return $supportPlan->load(['supportPlanGoal', 'supportPlanDetail']);
    }

    public function updateSupportPlanById($id, $data)
    {
        $supportPlan = $this->model->findOrFail($id);

        $supportPlan->update([
            'staff_id'              => $data['staff_id'],
            'status'                => $data['status'],
            'is_assessed'           => $data['is_assessed'],
            'user_family_intention' => $data['user_family_intention'],
            'yearly_support_goal'   => $data['yearly_support_goal'],
        ]);

        $domains = [
            'community_life',
            'daily_life',
            'health',
            'leisure',
            'other_support'
        ];

        foreach ($domains as $domain) {
            if (!empty($data[$domain])) {
                $goalData = $data[$domain];

                $supportCategories = is_array($goalData['support_category'])
                    ? json_encode($goalData['support_category'])
                    : $goalData['support_category'];

                $this->supportPlanGoal::updateOrCreate(
                    [
                        'support_plan_id' => $supportPlan->id,
                        'domain'          => $domain,
                    ],
                    [
                        'support_category'     => $supportCategories,
                        'goal'                 => $goalData['goal'] ?? null,
                        'support_content'      => $goalData['support_content'] ?? null,
                        'progress_first_term'  => $goalData['progress_first_term'] ?? null,
                        'progress_second_term' => $goalData['progress_second_term'] ?? null,
                    ]
                );
            }
        }


        $this->supportPlanDetail::where('support_plan_id', $supportPlan->id)->delete();

        if (!empty($data['support_details']) && is_array($data['support_details'])) {
            foreach ($data['support_details'] as $detail) {
                if (!empty($detail['item']) || !empty($detail['detail'])) {
                    $this->supportPlanDetail::create([
                        'support_plan_id' => $supportPlan->id,
                        'activity_time'   => $detail['time'] ?? null,
                        'activity_name'   => $detail['item'] ?? null,
                        'description'     => $detail['detail'] ?? null,
                        'created_by'      => $data['staff_id'] ?? null,
                    ]);
                }
            }
        }

        return $supportPlan->load(['supportPlanGoal', 'supportPlanDetail']);
    }


    public function getSupportPlanItemById($id)
    {
        $query = $this->model->with(['supportPlanGoal', 'supportPlanDetail'])->findOrFail($id);
        return $query;
    }

    public function deleteSupportPlan($id)
    {
        $supportPlan = $this->model->with(['supportPlanGoal', 'supportPlanDetail'])->findOrFail($id);

        $this->supportPlanGoal::where('support_plan_id', $id)->delete();
        $this->supportPlanDetail::where('support_plan_id', $id)->delete();

        $supportPlan->delete();

        return true;
    }
}
