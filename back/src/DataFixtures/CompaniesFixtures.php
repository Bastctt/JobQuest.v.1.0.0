<?php

namespace App\DataFixtures;

use App\Entity\Companies;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CompaniesFixtures extends Fixture
{
    public const COMPANY_REFERENCE = "company-";

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i < 20; $i++) {
            $company = new Companies();

            $company->setName($faker->company());
            $company->setAnneeCreation($faker->year());
            $company->setSiegeSocialVille($faker->city());
            $manager->persist($company);
            $this->addReference(self::COMPANY_REFERENCE . $i, $company);
        }

        $manager->flush();
    }
}
