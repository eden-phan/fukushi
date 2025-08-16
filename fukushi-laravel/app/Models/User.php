<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Modules\Profile\Models\Profile;
use Modules\Facility\Models\Facility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Modules\Deposit\Models\Deposit;
use Modules\Document\Models\Document;
use Modules\FacilityUser\Models\FacilityUser;
use Modules\SupportPlan\Models\SupportPlan;
use Modules\SupportPlanReview\Models\SupportPlanReview;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'employment_type',
        'start_date',
        'work_type',
        'work_shift'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        // TODO: Implement getJWTIdentifier() method.
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        // TODO: Implement getJWTCustomClaims() method.
        return [];
    }

    public function staffProfile()
    {
        return $this->hasOne(Profile::class)->where('user_type', 'user');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function facility()
    {
        return $this->hasOne(Facility::class);
    }

    public function facilityUser()
    {
        return $this->hasOne(FacilityUser::class);
    }

    public function document()
    {
        return $this->hasOne(Document::class, 'staff_id');
    }

    public function deposit()
    {
        return $this->hasMany(Deposit::class, 'staff_id');
    }

    public function supportPlan()
    {
        return $this->hasMany(SupportPlan::class, 'created_by');
    }

    public function supportPlanReview()
    {
        return $this->hasMany(SupportPlanReview::class, 'created_by');
    }
}
