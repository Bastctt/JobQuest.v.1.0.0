<?php

namespace App\Entity;

use App\Repository\CompaniesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CompaniesRepository::class)]
class Companies
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['list_company'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_jobs', 'list_company', 'create_company'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_company', 'create_company'])]
    private ?string $anneeCreation = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_company', 'create_company'])]
    private ?string $siegeSocialVille = null;

    /**
     * @var Collection<int, Jobs>
     */
    #[ORM\OneToMany(targetEntity: Advertisements::class, mappedBy: 'company', orphanRemoval: true, cascade: ['remove'])]
    private Collection $jobs;

    public function __construct()
    {
        $this->jobs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getAnneeCreation(): ?string
    {
        return $this->anneeCreation;
    }

    public function setAnneeCreation(string $anneeCreation): static
    {
        $this->anneeCreation = $anneeCreation;

        return $this;
    }

    public function getSiegeSocialVille(): ?string
    {
        return $this->siegeSocialVille;
    }

    public function setSiegeSocialVille(string $siegeSocialVille): static
    {
        $this->siegeSocialVille = $siegeSocialVille;

        return $this;
    }

    /**
     * @return Collection<int, Jobs>
     */
    public function getJobs(): Collection
    {
        return $this->jobs;
    }

    public function addJob(Advertisements $job): static
    {
        if (!$this->jobs->contains($job)) {
            $this->jobs->add($job);
            $job->setCompany($this);
        }

        return $this;
    }

    public function removeJob(Advertisements $job): static
    {
        if ($this->jobs->removeElement($job)) {
            if ($job->getCompany() === $this) {
                $job->setCompany(null);
            }
        }

        return $this;
    }
}
