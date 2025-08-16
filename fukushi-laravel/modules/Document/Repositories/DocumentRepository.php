<?php

namespace Modules\Document\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\Document\Models\Document;

class DocumentRepository extends BaseRepository
{
    public function getModel()
    {
        return Document::class;
    }

    public function findById($id)
    {
        $user = \App\Models\User::with('document')->find($id);
        return $user?->document;
    }

    public function create($data)
    {
        return Document::create($data);
    }

    public function update($data, $id)
    {
        return Document::findOrFail($id)->update($data);
    }
}
