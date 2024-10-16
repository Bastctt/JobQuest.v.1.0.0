<?php

namespace App\DataFixtures;

use App\Entity\Advertisements;
use App\Entity\Applications;
use App\Entity\People;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;

class ApplicationsFixtures extends Fixture implements DependentFixtureInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function load(ObjectManager $manager): void
    {
        $jobsCount = $manager->getRepository(Advertisements::class)->count([]);
        $userCount = $manager->getRepository(People::class)->count([]);
        $appliedCombinations = [];

        for ($i = 0; $i < 20; $i++) {
            $idJob = mt_rand(0, $jobsCount - 1);
            $job = $this->getReference("job-" . $idJob);

            $idUser = mt_rand(0, $userCount - 1);
            $user = $this->getReference("user-" . $idUser);

            $currentDate = new DateTime();

            $combinationKey = $user->getId() . '-' . $job->getId();

            if (!in_array($combinationKey, $appliedCombinations, true)) {
                $existingApplication = $this->entityManager->getRepository(Applications::class)
                    ->findOneBy(['job' => $job, 'user' => $user]);

                if (!$existingApplication) {
                    $application = new Applications();
                    $application->setAdvertisements($job);
                    $application->setPeople($user);
                    $application->setCreationDate($currentDate);
                    $manager->persist($application);
                    $appliedCombinations[] = $combinationKey;
                } else {
                    echo "Application already exists for user {$user->getId()} and job {$job->getId()}.\n";
                }
            } else {
                echo "Duplicate combination for user {$user->getId()} and job {$job->getId()}. Skipping...\n";
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            AdvertisementsFixtures::class,
            PeopleFixtures::class,
        ];
    }
}
