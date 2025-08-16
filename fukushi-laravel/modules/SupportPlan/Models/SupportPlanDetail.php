<?php

namespace Modules\SupportPlan\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\SupportPlan\Models\SupportPlan;

class SupportPlanDetail extends Model{
    use HasFactory;

    protected $fillable = [
        'support_plan_id',
        'activity_time',
        'activity_name',
        'description',
        'created_by'
    ];

    public function supportPlan(){
        return $this->belongsTo(SupportPlan::class, 'support_plan_id');
    }
}