<?php

namespace App\Controller;

use App\Entity\Applications;
use App\Entity\ApplicationsNoUser;
use App\Repository\AdvertisementsRepository;
use App\Repository\ApplicationsRepository;
use App\Repository\ApplicationsNoUserRepository;
use App\Repository\PeopleRepository;
use DateTime;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

#[Route('/api')]
class ApplicationsController extends AbstractController
{
    #[OA\Get(
        path: "/api/user/applications",
        summary: "Get user applications",
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
        responses: [
            new OA\Response(
                response: 200,
                description: "Returns the list of user applications",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        type: "object",
                        properties: [
                            new OA\Property(property: "appliedAt", type: "string", format: "date-time"),
                            new OA\Property(property: "jobTitle", type: "string"),
                            new OA\Property(property: "companyName", type: "string")
                        ]
                    )
                )
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "User not found or no applications found"
            )
        ]
    )]
    #[Route('/user/applications', name: 'get_user_applications', methods: ['GET'])]
    public function show(Request $request, PeopleRepository $userRepository, ApplicationsRepository $applicationsRepository, SerializerInterface $serializer): Response
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

            $applications = $applicationsRepository->findBy(['user' => $user->getId()]);

            if (!$applications) {
                return new Response("No applications found for this user", Response::HTTP_NOT_FOUND);
            }

            $applicationsList = [];
            foreach ($applications as $application) {
                $job = $application->getAdvertisements();
                $company = $job->getCompany();

                $applicationsList[] = [
                    'appliedAt' => $application->getCreationDate(),
                    'jobTitle' => $job->getTitle(),
                    'companyName' => $company->getName()
                ];
            }

            $applicationsSerialized = $serializer->serialize($applicationsList, 'json');

            return new Response($applicationsSerialized, 200, [
                'content-type' => 'application/json'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Delete(
        path: "/api/user/applications",
        summary: "Delete a user application",
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
                type: "object",
                properties: [
                    new OA\Property(property: "job_id", type: "integer")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Application successfully deleted"
            ),
            new OA\Response(
                response: 400,
                description: "UUID or Job ID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "User or application not found"
            ),
            new OA\Response(
                response: 500,
                description: "An error occurred while deleting the application"
            )
        ]
    )]
    #[Route('/user/applications', name: 'delete_user_application', methods: ['DELETE'])]
    public function delete(Request $request, PeopleRepository $userRepository, ApplicationsRepository $applicationsRepository, EntityManagerInterface $entityManager): Response
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

            $data = json_decode($request->getContent(), true);
            $jobId = $data['job_id'] ?? null;

            if (!$jobId) {
                return new Response("Job ID not provided", Response::HTTP_BAD_REQUEST);
            }

            $application = $applicationsRepository->findOneBy([
                'user' => $user->getId(),
                'job' => $jobId
            ]);

            if (!$application) {
                return new Response("Application not found for this user and job", Response::HTTP_NOT_FOUND);
            }

            $entityManager->remove($application);
            $entityManager->flush();

            return new Response("Application successfully deleted", Response::HTTP_OK);
        } catch (\Exception $e) {
            return new Response("An error occurred: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Post(
        path: "/api/apply",
        summary: "Create a new application",
        parameters: [
            new OA\Parameter(
                name: "uuid",
                in: "header",
                required: false,
                schema: new OA\Schema(
                    type: "string"
                )
            )
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "job_id", type: "integer"),
                    new OA\Property(property: "first_name", type: "string"),
                    new OA\Property(property: "surname", type: "string"),
                    new OA\Property(property: "phone", type: "string"),
                    new OA\Property(property: "email", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Application successfully created"
            ),
            new OA\Response(
                response: 400,
                description: "UUID or required fields not provided"
            ),
            new OA\Response(
                response: 404,
                description: "Job or user not found"
            ),
            new OA\Response(
                response: 409,
                description: "Application already exists"
            ),
            new OA\Response(
                response: 500,
                description: "An error occurred while creating the application"
            )
        ]
    )]
    #[Route('/apply', name: 'create_application', methods: ['POST'])]
    public function apply(Request $request, PeopleRepository $userRepository, AdvertisementsRepository $jobsRepository, ApplicationsRepository $applicationsRepository, ApplicationsNoUserRepository $applicationsNoUserRepository, EntityManagerInterface $entityManager): Response
    {
        try {
            $uuid = $request->headers->get('uuid');

            $data = json_decode($request->getContent(), true);
            $jobId = $data['job_id'] ?? null;

            if (!$jobId) {
                return new Response("Job ID not provided", Response::HTTP_BAD_REQUEST);
            }

            $job = $jobsRepository->find($jobId);
            if (!$job) {
                return new Response("Job not found", Response::HTTP_NOT_FOUND);
            }

            if ($uuid) {
                $user = $userRepository->findOneBy(['uuid' => $uuid]);
                if (!$user) {
                    return new Response("User not found", Response::HTTP_NOT_FOUND);
                }

                $existingApplication = $applicationsRepository->findOneBy([
                    'user' => $user->getId(),
                    'job' => $job->getId()
                ]);

                if ($existingApplication) {
                    return new Response("Application already exists for this user and job", Response::HTTP_CONFLICT);
                }

                $application = new Applications();
                $application->setPeople($user);
                $application->setAdvertisements($job);
                $application->setCreationDate(new \DateTime());

                $entityManager->persist($application);
                $entityManager->flush();

                return new Response("Application successfully created", Response::HTTP_CREATED);
            }

            $firstName = $data['first_name'] ?? null;
            $surname = $data['surname'] ?? null;
            $phone = $data['phone'] ?? null;
            $email = $data['email'] ?? null;

            if (!$firstName || !$surname || !$phone || !$email) {
                return new Response("Missing required fields for non-connected user", Response::HTTP_BAD_REQUEST);
            }

            $applicationNoUser = new ApplicationsNoUser();
            $applicationNoUser->setJob($job);
            $applicationNoUser->setFirstName($firstName);
            $applicationNoUser->setSurname($surname);
            $applicationNoUser->setTel($phone);
            $applicationNoUser->setEmail($email);
            $applicationNoUser->setCreationDate(new DateTime());

            $entityManager->persist($applicationNoUser);
            $entityManager->flush();

            return new Response("Application for non-connected user successfully created", Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new Response("An error occurred: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Get(
        path: "/api/applications",
        summary: "Get all applications",
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
        responses: [
            new OA\Response(
                response: 200,
                description: "Returns the list of applications",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        type: "object",
                        properties: [
                            new OA\Property(property: "appliedAt", type: "string", format: "date-time"),
                            new OA\Property(property: "jobTitle", type: "string"),
                            new OA\Property(property: "companyName", type: "string"),
                            new OA\Property(property: "user", type: "string")
                        ]
                    )
                )
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 403,
                description: "Access denied. Admin privileges required."
            ),
            new OA\Response(
                response: 404,
                description: "User not found or no applications found"
            ),
            new OA\Response(
                response: 500,
                description: "An error occurred while fetching applications"
            )
        ]
    )]
    #[Route('/applications', name: 'get_applications', methods: ['GET'])]
    public function index(Request $request, PeopleRepository $userRepository, ApplicationsRepository $applicationsRepository, ApplicationsNoUserRepository $applicationsNoUserRepository, SerializerInterface $serializer): Response
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

            $applications = $applicationsRepository->findAll();
            $applicationsNoUser = $applicationsNoUserRepository->findAll();

            if (!$applications && !$applicationsNoUser) {
                return new Response("No applications found", Response::HTTP_NOT_FOUND);
            }

            $applicationsList = [];
            foreach ($applications as $application) {
                $job = $application->getAdvertisements();
                $company = $job->getCompany();
                $applicant = $application->getPeople();

                $applicationsList[] = [
                    'appliedAt' => $application->getCreationDate(),
                    'jobTitle' => $job->getTitle(),
                    'companyName' => $company->getName(),
                    'user' => $applicant->getUsername()
                ];
            }

            foreach ($applicationsNoUser as $application) {
                $job = $application->getJob();

                $applicationsList[] = [
                    'appliedAt' => $application->getCreationDate(),
                    'jobTitle' => $job->getTitle(),
                    'companyName' => $job->getCompany()->getName(),
                    'user' => $application->getFirstName() . ' ' . $application->getSurname()
                ];
            }

            $applicationsSerialized = $serializer->serialize($applicationsList, 'json');

            return new Response($applicationsSerialized, 200, [
                'content-type' => 'application/json'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Get(
        path: "/api/applications-no-user",
        summary: "Get all applications without users",
        responses: [
            new OA\Response(
                response: 200,
                description: "Returns the list of applications without users",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        type: "object",
                        properties: [
                            new OA\Property(property: "appliedAt", type: "string", format: "date-time"),
                            new OA\Property(property: "jobTitle", type: "string"),
                            new OA\Property(property: "companyName", type: "string"),
                            new OA\Property(property: "firstName", type: "string"),
                            new OA\Property(property: "surname", type: "string"),
                            new OA\Property(property: "phone", type: "string"),
                            new OA\Property(property: "email", type: "string")
                        ]
                    )
                )
            ),
            new OA\Response(
                response: 500,
                description: "An error occurred while fetching applications"
            )
        ]
    )]
    #[Route('/applications-no-user', name: 'get_applications_no_user', methods: ['GET'])]
    public function getApplicationsNoUser(ApplicationsNoUserRepository $applicationsNoUserRepository, SerializerInterface $serializer): Response
    {
        try {
            $applicationsNoUser = $applicationsNoUserRepository->findAll();

            if (empty($applicationsNoUser)) {
                return new Response(json_encode([]), Response::HTTP_OK, [
                    'content-type' => 'application/json'
                ]);
            }

            $applicationsList = [];
            foreach ($applicationsNoUser as $application) {
                $job = $application->getJob();
                $company = $job->getCompany();

                $applicationsList[] = [
                    'appliedAt' => $application->getCreationDate(),
                    'jobTitle' => $job->getTitle(),
                    'companyName' => $company->getName(),
                    'firstName' => $application->getFirstName(),
                    'surname' => $application->getSurname(),
                    'phone' => $application->getTel(),
                    'email' => $application->getEmail()
                ];
            }

            $applicationsSerialized = $serializer->serialize($applicationsList, 'json');

            return new Response($applicationsSerialized, 200, [
                'content-type' => 'application/json'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}