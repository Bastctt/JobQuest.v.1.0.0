<?php

namespace App\Entity;

class ApplicationsId
{
    private ?People $user = null;
    private ?Advertisements $job = null;

    public function __construct(?People $user, ?Advertisements $job)
    {
        $this->user = $user;
        $this->job = $job;
    }

    public function equals($other): bool
    {
        return $other instanceof ApplicationsId
            && $this->user === $other->user
            && $this->job === $other->job;
    }

    public function hashCode(): int
    {
        return crc32($this->user->getId() . '_' . $this->job->getId());
    }
}
