<?php

namespace Modules\SupportPlan\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\SupportPlan\Models\SupportPlan;

class SupportPlanGoal extends Model{
    use HasFactory;

    protected $fillable =  [
        'support_plan_id',
        'domain',
        'support_category',
        'goal',
        'support_content',
        'progress_first_term',
        'progress_second_term',
    ];

    public function supportPlan()
    {
        return $this->belongsTo(SupportPlan::class, 'support_plan_id');
    }
}

