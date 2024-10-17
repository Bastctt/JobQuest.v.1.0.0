<?php

namespace App\Controller;

use App\Entity\People;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Ramsey\Uuid\Uuid;
use OpenApi\Attributes as OA;

#[Route('/api')]
class AuthenticationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    #[OA\Post(
        path: "/api/login",
        summary: "User login",
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "username", type: "string"),
                    new OA\Property(property: "password", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Login successful",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "message", type: "string"),
                        new OA\Property(property: "user", type: "object", properties: [
                            new OA\Property(property: "username", type: "string"),
                            new OA\Property(property: "isActive", type: "boolean"),
                            new OA\Property(property: "email", type: "string"),
                            new OA\Property(property: "phone", type: "string"),
                            new OA\Property(property: "uuid", type: "string"),
                            new OA\Property(property: "roles", type: "array", items: new OA\Items(type: "string"))
                        ])
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Invalid credentials"
            ),
            new OA\Response(
                response: 401,
                description: "User not found or invalid credentials"
            )
        ]
    )]
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['username']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $username = $data['username'];
        $password = $data['password'];

        $user = $this->entityManager->getRepository(People::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'message' => 'Login successful',
            'user' => [
                'username' => $user->getUsername(),
                'isActive' => $user->isActive(),
                'email' => $user->getEmail(),
                'phone' => $user->getPhone(),
                'uuid' => $user->getUuid(),
                'roles' => $user->getRoles(),
                'cvPath' => $user->getCvPath()
            ]
        ], JsonResponse::HTTP_OK);
    }

    #[OA\Post(
        path: "/api/logout",
        summary: "User logout",
        responses: [
            new OA\Response(
                response: 200,
                description: "Logout successful",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "message", type: "string")
                    ]
                )
            )
        ]
    )]
    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return new JsonResponse(['message' => 'Logout successful'], JsonResponse::HTTP_OK);
    }

    #[OA\Post(
        path: "/api/register",
        summary: "User registration",
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "username", type: "string"),
                    new OA\Property(property: "password", type: "string"),
                    new OA\Property(property: "email", type: "string"),
                    new OA\Property(property: "phone", type: "string"),
                    new OA\Property(property: "first_name", type: "string"),
                    new OA\Property(property: "last_name", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Registration successful",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "message", type: "string"),
                        new OA\Property(property: "user", type: "string")
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Invalid data"
            ),
            new OA\Response(
                response: 409,
                description: "Username, email, or phone already taken"
            )
        ]
    )]
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['username']) || !isset($data['password']) || !isset($data['email']) || !isset($data['phone'])) {
            return new JsonResponse(['error' => 'Invalid data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $existingUsername = $this->entityManager->getRepository(People::class)->findOneBy(['username' => $data['username']]);
        if ($existingUsername) {
            return new JsonResponse(['error' => 'Username already taken'], JsonResponse::HTTP_CONFLICT);
        }

        $existingEmail = $this->entityManager->getRepository(People::class)->findOneBy(['email' => $data['email']]);
        if ($existingEmail) {
            return new JsonResponse(['error' => 'Email already taken'], JsonResponse::HTTP_CONFLICT);
        }

        $existingPhone = $this->entityManager->getRepository(People::class)->findOneBy(['phone' => $data['phone']]);
        if ($existingPhone) {
            return new JsonResponse(['error' => 'Phone already taken'], JsonResponse::HTTP_CONFLICT);
        }

        $user = new People();
        $myuuid = Uuid::uuid4();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setPhone($data['phone']);
        $user->setRoles(['ROLE_USER']);
        $user->setUuid($myuuid);
        $user->setActive(true);
        $user->setFirstName($data['first_name']);
        $user->setSurname($data['last_name']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Registration successful', 'user' => $myuuid], JsonResponse::HTTP_CREATED);
    }
}
