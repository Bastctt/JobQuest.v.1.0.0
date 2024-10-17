<?php

namespace App\Controller;

use App\Entity\People;
use App\Repository\PeopleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

#[Route('/api')]
class PeopleController extends AbstractController
{
    #[OA\Get(
        path: "/api/users",
        summary: "Get all users",
        responses: [
            new OA\Response(
                response: 200,
                description: "Returns the list of users",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        ref: new Model(type: People::class, groups: ["list_users"])
                    )
                )
            ),
            new OA\Response(
                response: 404,
                description: "No users found"
            )
        ]
    )]
    #[Route('/users', name: 'api_user_index', methods: ['GET'])]
    public function index(PeopleRepository $repository, SerializerInterface $serializer): Response
    {
        try {
            $users = $repository->findAll();

            if (!$users) {
                return new Response("No users found", Response::HTTP_NOT_FOUND);
            }

            $jobsSerialized = $serializer->serialize($users, 'json', ['groups' => 'list_users']);
            return new Response($jobsSerialized, 200, [
                'content-type' => 'application/json'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred while fetching users: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Get(
        path: "/api/users/show",
        summary: "Get a user by UUID",
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
                description: "Returns the user",
                content: new OA\JsonContent(
                    ref: new Model(type: People::class, groups: ["list_users"])
                )
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "User not found"
            )
        ]
    )]
    #[Route('/users/show', name: 'api_user_show', methods: ['GET'])]
    public function show(Request $request, PeopleRepository $userRepository, SerializerInterface $serializer): Response
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

            $user = $userRepository->findOneBy(['uuid' => $uuid]);

            if (!$user) {
                return new Response("User not found", Response::HTTP_NOT_FOUND);
            }

            $userSerialized = $serializer->serialize($user, 'json', ['groups' => 'list_users']);
            return new Response($userSerialized, 200, [
                'content-type' => 'application/json'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred while searching for user: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Delete(
        path: "/api/user",
        summary: "Delete a user by UUID",
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
                response: 204,
                description: "User deleted"
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "User not found"
            ),
            new OA\Response(
                response: 403,
                description: "You are not allowed to delete this user"
            )
        ]
    )]
    #[Route('/user', name: 'api_user_delete', methods: ['DELETE'])]
    public function delete(Request $request, PeopleRepository $repository, EntityManagerInterface $entityManager): Response
    {
        try {
            $uuid = $request->headers->get('uuid');

            if (!$uuid) {
                return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
            }

            $user = $repository->findOneBy(['uuid' => $uuid]);

            if (!$user) {
                return new Response("User not found", Response::HTTP_NOT_FOUND);
            }

            $requestingUser = $repository->findOneBy(['uuid' => $request->headers->get('uuid')]);

            if (!$requestingUser || $requestingUser->getId() !== $user->getId()) {
                return new Response("You are not allowed to delete this user.", Response::HTTP_FORBIDDEN);
            }

            $entityManager->remove($user);
            $entityManager->flush();

            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new Response("An error occurred while deleting the user: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Put(
        path: "/api/user",
        summary: "Update a user by UUID",
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
                ref: new Model(type: People::class, groups: ["create_user"])
            )
        ),
        responses: [
            new OA\Response(
                response: 204,
                description: "User updated"
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "User not found"
            ),
            new OA\Response(
                response: 403,
                description: "You are not allowed to modify this user's information"
            )
        ]
    )]
    #[Route('/user', name: 'api_user_change', methods: ['PUT'])]
    public function update(PeopleRepository $repository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, Request $request, SerializerInterface $serializer): Response
    {
        try {
            $uuid = $request->headers->get('uuid');

            if (!$uuid) {
                return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
            }

            $user = $repository->findOneBy(['uuid' => $uuid]);

            if (!$user) {
                return new Response("User not found", Response::HTTP_NOT_FOUND);
            }

            $requestingUser = $repository->findOneBy(['uuid' => $request->headers->get('uuid')]);

            if (!$requestingUser || $requestingUser->getId() !== $user->getId()) {
                return new Response("You are not allowed to modify this user's information.", Response::HTTP_FORBIDDEN);
            }

            $body = $request->getContent();
            $serializer->deserialize($body, People::class, 'json', ['object_to_populate' => $user]);

            $data = json_decode($body, true);
            if (isset($data['password']) && !empty($data['password'])) {
                $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
                $user->setPassword($hashedPassword);
            }

            $entityManager->flush();

            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new Response("An error occurred while updating the user: " . $e->getMessage(), Response::HTTP_BAD_REQUEST);
        }
    }

    #[OA\Get(
        path: "/api/user/cv/download",
        summary: "Download a user's CV by UUID",
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
                description: "Returns the CV file",
                content: new OA\MediaType(
                    mediaType: "application/pdf",
                    schema: new OA\Schema(
                        type: "string",
                        format: "binary"
                    )
                )
            ),
            new OA\Response(
                response: 400,
                description: "UUID not provided"
            ),
            new OA\Response(
                response: 404,
                description: "User or CV not found"
            )
        ]
    )]
    #[Route('/user/cv/download', name: 'download_cv', methods: ['GET'])]
    public function downloadCv(Request $request, PeopleRepository $repository): Response
    {
        $uuid = $request->headers->get('uuid');

        if (!$uuid) {
            return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
        }

        $user = $repository->findOneBy(['uuid' => $uuid]);

        if (!$user) {
            return new Response("User not found", Response::HTTP_NOT_FOUND);
        }

        $cvPath = $user->getCvPath();

        if (!$cvPath) {
            return new Response("CV not found", Response::HTTP_NOT_FOUND);
        }

        $cvFilePath = $this->getParameter('cv_directory') . '/' . $cvPath;

        if (!file_exists($cvFilePath)) {
            return new Response("File not found", Response::HTTP_NOT_FOUND);
        }

        $response = new BinaryFileResponse($cvFilePath);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($cvFilePath));

        return $response;
    }

    #[
        OA\Post(
            path: "/api/user/cv/upload",
            summary: "Upload a user's CV by UUID",
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
                required: true,
                content: new OA\MediaType(
                    mediaType: "multipart/form-data",
                    schema: new OA\Schema(
                        type: "object",
                        properties: [
                            new OA\Property(
                                property: "cv",
                                type: "string",
                                format: "binary"
                            )
                        ]
                    )
                )
            ),
            responses: [
                new OA\Response(
                    response: 204,
                    description: "CV uploaded successfully"
                ),
                new OA\Response(
                    response: 400,
                    description: "UUID not provided || CV not provided"
                ),
                new OA\Response(
                    response: 404,
                    description: "User not found"
                )
            ]
        )
    ]
    #[Route('/user/cv/upload', name: 'upload_cv', methods: ['POST'])]
    public function uploadCv(Request $request, PeopleRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $uuid = $request->headers->get('uuid');

        if (!$uuid) {
            return new Response("UUID not provided", Response::HTTP_BAD_REQUEST);
        }

        $user = $repository->findOneBy(['uuid' => $uuid]);

        if (!$user) {
            return new Response("User not found", Response::HTTP_NOT_FOUND);
        }

        $cvFile = $request->files->get('cv');

        if (!$cvFile) {
            return new Response("CV not provided", Response::HTTP_BAD_REQUEST);
        }

        $salt = bin2hex(random_bytes(8));
        $cvFileName = 'cv_' . $salt . '.' . $cvFile->guessExtension();
        $cvFile->move($this->getParameter('cv_directory'), $cvFileName);

        $user->setCvPath($cvFileName);
        $entityManager->flush();

        return new Response("CV uploaded successfully", Response::HTTP_NO_CONTENT);
    }
}
