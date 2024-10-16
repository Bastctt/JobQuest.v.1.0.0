<?php

namespace App\DataFixtures;

use App\Entity\Advertisements;
use App\Entity\Companies;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class AdvertisementsFixtures extends Fixture implements DependentFixtureInterface
{
    public const JOB_REFERENCE = "job-";

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create("fr_FR");
        $companyCount = $manager->getRepository(Companies::class)->count([]);
        for ($i = 0; $i < 20; $i++) {
            $job = new Advertisements();

            $job->setTitle($faker->randomElement(["Software engineer", "Data scientist", "Full-stack Developer", "Pen-tester", "CTO"]));
            $job->setLocation($faker->departmentName());
            $job->setJobType($faker->randomElement(['Full-time', 'Part-time', 'Freelance']));
            $job->setDescription($faker->catchPhrase());
            $idCompany = mt_rand(0, $companyCount - 1);
            $company = $this->getReference("company-" . $idCompany);
            $job->setCompany($company);
            $this->addReference(self::JOB_REFERENCE . $i, $job);
            $manager->persist($job);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CompaniesFixtures::class,
        ];
    }
}
