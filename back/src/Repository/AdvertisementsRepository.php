<?php

namespace App\Repository;

use App\Entity\Advertisements;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Jobs>
 */
class AdvertisementsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Advertisements::class);
    }

    public function findAllWithTotalApplications()
    {
        return $this->createQueryBuilder('j')
            ->select('j', 'COUNT(DISTINCT a.user) AS applicationsCount', 'COUNT(DISTINCT na.id) AS nonConnectedApplicationsCount')
            ->leftJoin('j.applications', 'a')
            ->leftJoin('j.applicationsNoUsers', 'na')
            ->groupBy('j.id')
            ->getQuery()
            ->getResult();
    }



    //    /**
    //     * @return Jobs[] Returns an array of Jobs objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('j')
    //            ->andWhere('j.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('j.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Jobs
    //    {
    //        return $this->createQueryBuilder('j')
    //            ->andWhere('j.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
