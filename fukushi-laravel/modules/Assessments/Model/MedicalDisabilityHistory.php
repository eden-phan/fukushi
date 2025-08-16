<?php

namespace Modules\Assessments\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\ServiceUser\Models\ServiceUser;

class MedicalDisabilityHistory extends Model
{
    use HasFactory;

    protected $table = 'medical_disability_history';

    protected $fillable = [
        'service_user_id',
        'date',
        'detail',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class);
    }
}