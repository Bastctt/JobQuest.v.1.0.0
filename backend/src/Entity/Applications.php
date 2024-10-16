<?php

namespace App\Entity;

use App\Repository\ApplicationsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ApplicationsRepository::class)]
#[ORM\Table(name: 'applications')]
#[ORM\IdClass(ApplicationsId::class)]
class Applications
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: People::class, inversedBy: 'applications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?People $user = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Advertisements::class, inversedBy: 'applications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Advertisements $job = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $creationDate = null;

    public function getPeople(): ?People
    {
        return $this->user;
    }

    public function setPeople(?People $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getAdvertisements(): ?Advertisements
    {
        return $this->job;
    }

    public function setAdvertisements(?Advertisements $job): static
    {
        $this->job = $job;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): static
    {
        $this->creationDate = $creationDate;

        return $this;
    }
}
