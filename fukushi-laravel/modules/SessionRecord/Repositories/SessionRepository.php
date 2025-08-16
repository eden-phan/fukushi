<?php

namespace Modules\SessionRecord\Repositories;

use Modules\Core\Repositories\BaseRepository;
use Modules\SessionRecord\Models\SessionRecord;

class SessionRepository extends BaseRepository
{

    protected $model;
    public function __construct(SessionRecord $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return $this->model;
    }

    /**
     * Get all sessions with participants
     */
    public function getAll(
        $record_type = null,
        $perPage = 10,
        $page = 1,
        $sortBy = 'created_at',
        $sortDirection = 'desc',
        $keyword = null,
        $startDate = null,
        $endDate = null,
        $with = [],
    ) {

        $query = $this->model->with('participants');

        if ($record_type) {
            $query->where('record_type', $record_type);
        }

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('theme', 'like', '%' . $keyword . '%')
                    ->orWhere('location', 'like', '%' . $keyword . '%');
            });
        }

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        if ($with) {
            $query->with($with);
        }
        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage, ['*'], 'page', $page)
            ->appends([
                'sortBy' => $sortBy,
            'sortDirection' => $sortDirection
            ]);
    }

    /**
     * Get a session by ID with participants
     */
    public function getSession($sessionId)
    {
        $session = $this->model->find($sessionId);
        if (!$session) {
            return null;
        }
        return $session;
    }

    /**
     * Create a new session
     */
    public function createSession(array $validatedData)
    {
        $session = new $this->model;
        $session->record_type = $validatedData['record_type'];
        $session->theme = $validatedData['theme'];
        $session->date = $validatedData['date'];
        $session->start_time = $validatedData['start_time'];
        $session->end_time = $validatedData['end_time'];
        $session->location = $validatedData['location'] ?? null;
        $session->content = $validatedData['content'] ?? null;
        $session->feedback = $validatedData['feedback'] ?? null;
        $session->save();

        return $session;
    }

    /**
     * Update an existing session
     */
    public function updateSession($sessionId, array $validatedData)
    {
        $session = $this->model->find($sessionId);
        if (!$session) {
            return null;
        }

        $session->record_type = $validatedData['record_type'];
        $session->theme = $validatedData['theme'];
        $session->date = $validatedData['date'];
        $session->start_time = $validatedData['start_time'];
        $session->end_time = $validatedData['end_time'];
        $session->location = $validatedData['location'] ?? null;
        $session->content = $validatedData['content'] ?? null;
        $session->feedback = $validatedData['feedback'] ?? null;
        $session->save();

        return $session;
    }

    /**
     * Delete a session
     */
    public function deleteSession($sessionId)
    {
        $session = $this->model->find($sessionId);
        if (!$session) {
            return null;
        }

        $session->delete();
        return true;
    }
}
