<?php

namespace Modules\FamilyMember\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\FamilyMember\Models\FamilyMember;
use Modules\Consultation\Models\Consultation;

class FamilyMemberRepository extends BaseRepository
{
    protected $model;

    public function __construct(FamilyMember $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return FamilyMember::class;
    }

    public function getAllFamilyMemberByConsultationId($consultationId)
    {
        return $this->model
            ->whereHas('pivotRecords', function ($query) use ($consultationId) {
                $query->where('consultation_id', $consultationId);
            })
            ->with(['pivotRecords' => function ($query) use ($consultationId) {
                $query->where('consultation_id', $consultationId)->with('serviceUser', 'consultation');
            }])
            ->get();
    }

    public function getAllFamilyMember(
        $getAll = false,
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $search = null,
        $filters = [],
        $with = ['creator']
    ) {
        $query = $this->model->with($with);

        if ($getAll) return $query->orderBy($sortBy, $sortDirection)->get();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters)) {
            foreach ($filters as $field => $value) {
                $query->where($field, $value);
            }
        }

        $query->orderBy($sortBy, $sortDirection);

        $result = $query->paginate($perPage, ['*'], 'page', $page)
            ->appends([
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'search' => $search,
                'filters' => $filters,
            ]);

        return $result;
    }

    public function findFamilyMemberById($id, $with = ['creator'])
    {
        $familyMember = $this->model->with($with)->find($id);

        if (!$familyMember) {
            return null;
        }

        return $familyMember;
    }

    public function createFamilyMembersWithConsultation(int $consultationId, array $familyMembersData)
    {
        $consultation = Consultation::findOrFail($consultationId);

        $consultation->familyMembers()->detach();

        $familyMemberIds = [];

        foreach ($familyMembersData as $memberData) {
            if (!empty($memberData['id']) && $existing = $this->model->find($memberData['id'])) {
                $existing->update($memberData);
                $familyMemberIds[] = $existing->id;
            } else {
                $new = $this->createFamilyMember($memberData);
                $familyMemberIds[] = $new->id;
            }
        }

        $consultation->familyMembers()->attach($familyMemberIds);
    }

    public function createFamilyMember(array $data)
    {
        $familyMember = $this->model->create([
            'name' => $data['name'],
            'age' => $data['age'],
            'relationship' => $data['relationship'],
            'occupation' => $data['occupation'],
            'living_status' => $data['living_status'],
            'note' => $data['note'],
            'created_by' => $data['created_by'],
        ]);

        return $familyMember;
    }

    public function updateFamilyMember($id, array $data)
    {
        $familyMember = $this->model->find($id);

        if (!$familyMember) {
            return null;
        }

        $familyMember->update([
            'name' => $data['name'],
            'age' => $data['age'],
            'relationship' => $data['relationship'],
            'occupation' => $data['occupation'],
            'living_status' => $data['living_status'],
            'note' => $data['note'],
        ]);

        return $familyMember;
    }

    public function deleteFamilyMember($id)
    {
        $familyMember = $this->model->find($id);

        if (!$familyMember) {
            return false;
        }

        $familyMember->delete();

        return true;
    }
}
