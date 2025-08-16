<?php

namespace Modules\SupportPlanReview\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\SupportPlan\Models\SupportPlan;

class SupportPlanReview extends Model{
    use HasFactory;
    protected $fillable =  [
        'support_plan_id',
        'meeting_date',
        'content',
        'opinion',
        'change',
        'created_by',
    ];

    public function supportPlan()
    {
        return $this->belongsTo(SupportPlan::class, 'support_plan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}