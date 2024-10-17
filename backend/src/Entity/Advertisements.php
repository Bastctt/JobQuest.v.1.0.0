<?php

namespace App\Entity;

use App\Repository\AdvertisementsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: AdvertisementsRepository::class)]
class Advertisements
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['list_jobs'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_jobs', 'create_job'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_jobs', 'create_job'])]
    private ?string $location = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_jobs', 'create_job'])]
    private ?string $jobType = null;

    /**
     * @var Collection<int, Applications>
     */
    #[ORM\OneToMany(targetEntity: Applications::class, mappedBy: 'job', orphanRemoval: true, cascade: ['remove'])]
    private Collection $applications;

    #[ORM\ManyToOne(inversedBy: 'jobs', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['list_jobs'])]
    private ?Companies $company = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['list_jobs', 'create_job'])]
    private ?string $description = null;

    /**
     * @var Collection<int, ApplicationsNoUser>
     */
    #[ORM\OneToMany(targetEntity: ApplicationsNoUser::class, mappedBy: 'job')]
    private Collection $applicationsNoUsers;

    public function __construct()
    {
        $this->applications = new ArrayCollection();
        $this->applicationsNoUsers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getJobType(): ?string
    {
        return $this->jobType;
    }

    public function setJobType(string $jobType): static
    {
        $this->jobType = $jobType;

        return $this;
    }

    /**
     * @return Collection<int, Applications>
     */
    public function getApplications(): Collection
    {
        return $this->applications;
    }

    public function addApplication(Applications $application): static
    {
        if (!$this->applications->contains($application)) {
            $this->applications->add($application);
            $application->setAdvertisements($this);
        }

        return $this;
    }

    public function removeApplication(Applications $application): static
    {
        if ($this->applications->removeElement($application)) {
            // set the owning side to null (unless already changed)
            if ($application->getAdvertisements() === $this) {
                $application->setAdvertisements(null);
            }
        }

        return $this;
    }

    public function getCompany(): ?Companies
    {
        return $this->company;
    }

    public function setCompany(?Companies $company): static
    {
        $this->company = $company;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, ApplicationsNoUser>
     */
    public function getApplicationsNoUsers(): Collection
    {
        return $this->applicationsNoUsers;
    }

    public function addApplicationsNoUser(ApplicationsNoUser $applicationsNoUser): static
    {
        if (!$this->applicationsNoUsers->contains($applicationsNoUser)) {
            $this->applicationsNoUsers->add($applicationsNoUser);
            $applicationsNoUser->setJob($this);
        }

        return $this;
    }

    public function removeApplicationsNoUser(ApplicationsNoUser $applicationsNoUser): static
    {
        if ($this->applicationsNoUsers->removeElement($applicationsNoUser)) {
            // set the owning side to null (unless already changed)
            if ($applicationsNoUser->getJob() === $this) {
                $applicationsNoUser->setJob(null);
            }
        }

        return $this;
    }
}
