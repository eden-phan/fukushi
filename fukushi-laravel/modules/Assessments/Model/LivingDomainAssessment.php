<?php

namespace Modules\Assessments\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LivingDomainAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'key',
        'current_status',
        'support_needed',
        'preference',
        'environment_limitations_notes',
        'abilities_limitations_notes'
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessments::class);
    }
}
