<?php

namespace Modules\SupportPlan\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\ServiceUser\Models\ServiceUser;
use Modules\SupportPlan\Models\SupportPlanGoal as ModelsSupportPlanGoal;
use Modules\SupportPlanReview\Models\SupportPlanReview;
use SupportPlanGoal;

class SupportPlan extends Model{
    use HasFactory;
    protected $fillable =  [
        'plan_type',
        'service_user_id',
        'staff_id',
        'service_type',
        'user_family_intention',
        'yearly_support_goal',
        'status',
        'is_assessed'
    ];

    protected $appends = ['profile'];
    
    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class, 'service_user_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'staff_id');
    }

    public function supportPlanReview()
    {
        return $this->hasOne(SupportPlanReview::class, 'support_plan_id');
    }

    public function getProfileAttribute()
    {
        return $this->serviceUser ? $this->serviceUser->profile : null;
    }

    public function supportPlanGoal()
    {
        return $this->hasMany(ModelsSupportPlanGoal::class);
    }

    public function supportPlanDetail()
    {
        return $this->hasMany(SupportPlanDetail::class);
    }
}