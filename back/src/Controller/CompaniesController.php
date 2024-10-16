<?php

namespace App\Controller;

use App\Entity\Companies;
use App\Repository\CompaniesRepository;
use App\Repository\PeopleRepository;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

#[Route('/api')]
class CompaniesController extends AbstractController
{
    #[OA\Get(
        path: "/api/company",
        summary: "Get all companies",
        responses: [
            new OA\Response(
                response: 200,
                description: "Returns the list of companies",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        ref: new Model(type: Companies::class, groups: ["list_company"])
                    )
                )
            ),
            new OA\Response(
                response: 404,
                description: "No companies found"
            )
        ]
    )]
    #[Route('/company', name: 'app_company', methods: ['GET'])]
    public function index(CompaniesRepository $repository, SerializerInterface $serializer): Response
    {
        $company = $repository->findAll();
        $companySerialized = $serializer->serialize($company, 'json', ['groups' => 'list_company']);
        return new Response($companySerialized, 200, [
            'content-type' => 'application/json'
        ]);
    }

    #[OA\Delete(
        path: "/api/company/{id}",
        summary: "Delete a company by ID",
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
                description: "Company deleted"
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
            )
        ]
    )]
    #[Route('/company/{id}', name: 'api_company_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(CompaniesRepository $repository, EntityManagerInterface $entityManager, Request $request, int $id, PeopleRepository $userRepository): Response
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

            $company = $repository->find($id);

            if (!$company) {
                return new Response("Company not found", Response::HTTP_NOT_FOUND);
            }

            $entityManager->remove($company);
            $entityManager->flush();

            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new Response("An error occurred while deleting the company: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[OA\Put(
        path: "/api/company/{id}",
        summary: "Update a company by ID",
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
                ref: new Model(type: Companies::class, groups: ["create_company"])
            )
        ),
        responses: [
            new OA\Response(
                response: 204,
                description: "Company updated"
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
            )
        ]
    )]
    #[Route('/company/{id}', name: 'api_company_change', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function update(CompaniesRepository $repository, EntityManagerInterface $entityManager, int $id, Request $request, SerializerInterface $serializer, PeopleRepository $userRepository): Response
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

            $company = $repository->find($id);

            if (!$company) {
                return new Response("Company not found", Response::HTTP_NOT_FOUND);
            }

            $body = $request->getContent();
            $serializer->deserialize($body, Companies::class, 'json', ['object_to_populate' => $company]);

            $entityManager->flush();

            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new Response("An error occurred while updating the company: " . $e->getMessage(), Response::HTTP_BAD_REQUEST);
        }
    }

    #[OA\Post(
        path: "/api/company",
        summary: "Create a new company",
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
                ref: new Model(type: Companies::class, groups: ["create_company"])
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Company created",
                content: new OA\JsonContent(
                    ref: new Model(type: Companies::class, groups: ["list_company"])
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
                response: 500,
                description: "An error occurred while creating the company"
            )
        ]
    )]
    #[Route('/company', name: 'api_company_create', methods: ['POST'])]
    public function create(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager, PeopleRepository $userRepository): Response
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

            $company = $serializer->deserialize($jsonContent, Companies::class, 'json', ['groups' => 'create_company']);

            $entityManager->persist($company);
            $entityManager->flush();

            return $this->json($company, Response::HTTP_CREATED, [], [
                'groups' => 'list_company'
            ]);
        } catch (\Exception $e) {
            return new Response("An error occurred while creating the company: " . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
