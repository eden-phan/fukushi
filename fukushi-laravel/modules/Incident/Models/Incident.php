<?php

namespace Modules\Incident\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\ServiceUser\Models\ServiceUser;

class Incident extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function serviceUser()
    {
        return $this->belongsTo(ServiceUser::class, 'service_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
