<?php

namespace App\Controller;

use App\Entity\Advertisements;
use App\Repository\AdvertisementsRepository;
use App\Repository\CompaniesRepository;
use App\Repository\PeopleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

#[Route('/api')]
class AdvertisementsController extends AbstractController
{
    #[OA\Get(
        path: "/api/jobs",
        summary: "Get all jobs",
        responses: [
            new OA\Response(
                response: 200,
                description: "Returns the list of jobs",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        ref: new Model(type: Advertisements::class, groups: ["list_jobs"])
                    )
                )
            ),
            new OA\Response(
                response: 404,
                description: "No jobs found"
            )
        ]
    )]
    #[Route('/jobs', name: 'api_jobs_index', methods: ['GET'])]
    public function index(AdvertisementsRepository $repository, SerializerInterface $serializer): Response
    {
        try {
            $jobs = $repository->findAllWithTotalApplications();

            if (!$jobs) {
                return new Response("No jobs found", Response::HTTP_NOT_FOUND);
            }

            $jobList = [];
            foreach ($jobs as $jobData) {
                $job = $jobData[0];
                $applicationsCount = $jobData['applicationsCount'];
                $nonConnectedApplicationsCount = $jobData['nonConnectedApplicationsCount'];
                $totalApplications = $applicationsCount + $nonConnectedApplicationsCount;

                $jobList[] = [
                    'id' => $job->getId(),
                    'title' => $job->getTitle(),
                    'location' => $job->getLocation(),
                    'jobType' => $job->getJobType(),
                    'company' => [
                        'name' => $job->getCompany()->getName(),
                        'id' => $job->getCompany()->getId()
                    ],
                    'description' => $job->getDescription(),
                    'totalApplications' => $totalApplications
                ];
            }

            $jobsSerialized = $serializer->serialize($jobList, 'json', ['groups' => 'list_jobs']);
            return new Response($jobsSerialized, 200, [
                'content-type' => 'application/json'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred while fetching jobs: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Delete(
        path: "/api/jobs/{id}",
        summary: "Delete a job by ID",
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(
                    type: "integer"
                )
            ),
            new OA\Parameter(
                name: "uuid",
                in: "header",
                required: true,
                schema: new OA\Schema(
                    type: "string"
                )
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: "Job deleted"
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "Job not found"
            ),
            new OA\Response(
                response: 403,
                description: "Access denied. Admin privileges required."
            )
        ]
    )]
    #[Route('/jobs/{id}', name: 'api_jobs_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(PeopleRepository $userRepository, Request $request, AdvertisementsRepository $repository, EntityManagerInterface $entityManager, int $id): Response
    {
        try {
            $uuid = $request->headers->get('uuid');

            if (!$uuid) {
                return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
            }

            $user = $userRepository->findOneBy(['uuid' => $uuid]);

            if (!$user) {
                return new Response("User not found", Response::HTTP_NOT_FOUND);
            }

            if (!in_array('ROLE_ADMIN', $user->getRoles())) {
                return new Response("Access denied. Admin privileges required.", Response::HTTP_FORBIDDEN);
            }

            $job = $repository->find($id);

            if (!$job) {
                return new Response("Job not found", Response::HTTP_NOT_FOUND);
            }

            $entityManager->remove($job);
            $entityManager->flush();
            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new Response("An error occurred while deleting the job: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Put(
        path: "/api/jobs/{id}",
        summary: "Update a job by ID",
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(
                    type: "integer"
                )
            ),
            new OA\Parameter(
                name: "uuid",
                in: "header",
                required: true,
                schema: new OA\Schema(
                    type: "string"
                )
            )
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                ref: new Model(type: Advertisements::class, groups: ["create_job"])
            )
        ),
        responses: [
            new OA\Response(
                response: 204,
                description: "Job updated"
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "Job not found"
            ),
            new OA\Response(
                response: 403,
                description: "Access denied. Admin privileges required."
            )
        ]
    )]
    #[Route('/jobs/{id}', name: 'api_jobs_change', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function update(PeopleRepository $userRepository, AdvertisementsRepository $repository, EntityManagerInterface $entityManager, int $id, Request $request, SerializerInterface $serializer): Response
    {
        try {
            $uuid = $request->headers->get('uuid');

            if (!$uuid) {
                return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
            }

            $user = $userRepository->findOneBy(['uuid' => $uuid]);

            if (!$user) {
                return new Response("User not found", Response::HTTP_NOT_FOUND);
            }

            if (!in_array('ROLE_ADMIN', $user->getRoles())) {
                return new Response("Access denied. Admin privileges required.", Response::HTTP_FORBIDDEN);
            }

            $job = $repository->find($id);

            if (!$job) {
                return new Response("Job not found", Response::HTTP_NOT_FOUND);
            }

            $body = $request->getContent();
            $serializer->deserialize($body, Advertisements::class, 'json', ['object_to_populate' => $job]);

            $entityManager->flush();
            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new Response("An error occurred while updating the job: " . $e->getMessage(), Response::HTTP_BAD_REQUEST);
        }
    }

    #[OA\Post(
        path: "/api/jobs",
        summary: "Create a new job",
        parameters: [
            new OA\Parameter(
                name: "uuid",
                in: "header",
                required: true,
                schema: new OA\Schema(
                    type: "string"
                )
            )
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                ref: new Model(type: Advertisements::class, groups: ["create_job"])
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Job created",
                content: new OA\JsonContent(
                    ref: new Model(type: Advertisements::class, groups: ["list_jobs"])
                )
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "Company not found"
            ),
            new OA\Response(
                response: 403,
                description: "Access denied. Admin privileges required."
            ),
            new OA\Response(
                response: 500,
                description: "An error occurred while creating the job"
            )
        ]
    )]
    #[Route('/jobs', name: 'api_jobs_create', methods: ['POST'])]
    public function create(PeopleRepository $userRepository, Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager, CompaniesRepository $companyRepo): Response
    {
        $jsonContent = $request->getContent();

        try {
            $uuid = $request->headers->get('uuid');

            if (!$uuid) {
                return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
            }

            $user = $userRepository->findOneBy(['uuid' => $uuid]);

            if (!$user) {
                return new Response("User not found", Response::HTTP_NOT_FOUND);
            }

            if (!in_array('ROLE_ADMIN', $user->getRoles())) {
                return new Response("Access denied. Admin privileges required.", Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($jsonContent, true);

            if (!$data) {
                return new Response("Invalid JSON format", Response::HTTP_BAD_REQUEST);
            }

            $companyData = $data['company'] ?? null;
            if (!$companyData || !isset($companyData['id'])) {
                return new Response("Company ID is required", Response::HTTP_BAD_REQUEST);
            }

            $company = $companyRepo->find($companyData['id']);
            if (!$company) {
                return new Response("Company not found", Response::HTTP_NOT_FOUND);
            }

            $jobJson = json_encode($data);
            $job = $serializer->deserialize($jobJson, Advertisements::class, 'json', ['groups' => 'create_job']);

            $job->setCompany($company);

            $entityManager->persist($job);
            $entityManager->flush();

            return $this->json($job, Response::HTTP_CREATED, [], [
                'groups' => 'list_jobs'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred while creating the job: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

