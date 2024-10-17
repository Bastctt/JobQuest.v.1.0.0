<?php

namespace App\DataFixtures;

use App\Entity\People;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Ramsey\Uuid\Uuid;

class PeopleFixtures extends Fixture
{
    public const USER_REFERENCE = "user-";
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i < 10; $i++) {
            $user = new People();
            $myuuid = Uuid::uuid4();
            $user->setUsername($faker->userName());

            $plainPassword = 'user';
            $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $user->setEmail($faker->email());
            $user->setPhone($faker->phoneNumber());
            $user->setUuid($myuuid);
            $user->setFirstName($faker->firstName());
            $user->setSurname($faker->lastName());
            $this->addReference(self::USER_REFERENCE . $i, $user);
            $manager->persist($user);
        }

        $manager->flush();
    }
}
