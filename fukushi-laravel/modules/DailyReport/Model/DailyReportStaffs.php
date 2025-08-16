<?php

namespace Modules\DailyReport\Model;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReportStaffs extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'daily_report_id',
        'staff_id',
        'work_content',
        'shift_type',
        'shift_hours',
        'created_by',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'shift_hours' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_at = now();
        });
    }

    public function dailyReport()
    {
        return $this->belongsTo(DailyReport::class, 'daily_report_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

}