<?php

namespace Modules\FacilityUser\Repositories;

use Modules\FacilityUser\Models\FacilityUser;

class FacilityUserRepository
{

    protected $model;
    public function __construct(FacilityUser $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return FacilityUser::class;
    }

    /**
     * Lấy danh sách tất cả facility_user
     */
    public function getAll()
    {
        return $this->model->all();
    }

    /**
     * Tạo liên kết user - facility với role
     *
     * @param int $userId
     * @param int $facilityId
     * @param int $roleId
     * @param string|null $facilityRole
     * @return FacilityUser
     */
    public function create(int $userId, int $facilityId, int $roleId, ?string $facilityRole = null)
    {
        return $this->model->create([
            'user_id' => $userId,
            'facility_id' => $facilityId,
            'role_id' => $roleId,
            'facility_role' => $facilityRole ?? '',
        ]);
    }

    /**
     * Cập nhật role hoặc facility_role trong liên kết facility_user
     *
     * @param int $id
     * @param array $data ['role_id' => ..., 'facility_role' => ...]
     * @return bool
     */
    public function update(int $id, array $data)
    {
        $facilityUser = $this->model->findOrFail($id);
        return $facilityUser->update($data);
    }

    /**
     * Xóa liên kết facility_user theo id
     *
     * @param int $id
     * @return bool|null
     */
    public function delete(int $id)
    {
        $facilityUser = $this->model->findOrFail($id);
        return $facilityUser->delete();
    }

    /**
     * Tìm facility_user theo user_id và facility_id
     *
     * @param int $userId
     * @param int $facilityId
     * @return FacilityUser|null
     */
    public function findByUserAndFacility(int $userId, int $facilityId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('facility_id', $facilityId)
            ->first();
    }
}
