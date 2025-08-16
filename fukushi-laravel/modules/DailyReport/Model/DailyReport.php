<?php

namespace Modules\DailyReport\Model;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Signature\Models\Signature;

class DailyReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'entry_date',
        'day_shift_staff_id',
        'night_shift_staff_id',
        'support_content',
        'work_details',
        'note',
        'night_shift_note',
        'created_by',
    ];

    protected $casts = [
        'entry_date' => 'date',
    ];

    public function dayShiftStaff()
    {
        return $this->belongsTo(User::class, 'day_shift_staff_id');
    }

    public function nightShiftStaff()
    {
        return $this->belongsTo(User::class, 'night_shift_staff_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function dailyReportStaffs()
    {
        return $this->hasMany(DailyReportStaffs::class, 'daily_report_id');
    }

    public function dailyReportServiceUsers()
    {
        return $this->hasMany(DailyReportServiceUsers::class, 'daily_report_id');
    }

    public function signatures()
    {
        return $this->hasMany(Signature::class, 'document_id')->where('document_type', 'daily_report');
    }
}