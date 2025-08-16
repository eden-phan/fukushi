<?php

namespace Modules\DailyReport\Model;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\ServiceUser\Models\ServiceUser;

class DailyReportServiceUsers extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_report_id',
        'service_user_id',
        'overnight_stay',
        'hospitalized',
        'created_by',
    ];

    protected $casts = [
        'overnight_stay' => 'boolean',
        'hospitalized' => 'boolean',
    ];

    public function dailyReport()
    {
        return $this->belongsTo(DailyReport::class, 'daily_report_id');
    }

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class, 'service_user_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}