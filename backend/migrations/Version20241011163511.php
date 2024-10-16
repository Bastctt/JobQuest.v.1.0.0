<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241011163511 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE advertisements (id INT AUTO_INCREMENT NOT NULL, company_id INT NOT NULL, title LONGTEXT NOT NULL, location LONGTEXT NOT NULL, job_type LONGTEXT NOT NULL, description LONGTEXT NOT NULL, INDEX IDX_5C755F1E979B1AD6 (company_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE applications (user_id INT NOT NULL, job_id INT NOT NULL, creation_date DATETIME NOT NULL, INDEX IDX_F7C966F0A76ED395 (user_id), INDEX IDX_F7C966F0BE04EA9 (job_id), PRIMARY KEY(user_id, job_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE applications_no_user (id INT AUTO_INCREMENT NOT NULL, job_id INT DEFAULT NULL, surname LONGTEXT NOT NULL, first_name LONGTEXT NOT NULL, tel LONGTEXT NOT NULL, email LONGTEXT NOT NULL, creation_date DATETIME NOT NULL, INDEX IDX_6654BDFBE04EA9 (job_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE companies (id INT AUTO_INCREMENT NOT NULL, name LONGTEXT NOT NULL, annee_creation LONGTEXT NOT NULL, siege_social_ville LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE people (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, is_active TINYINT(1) DEFAULT 1 NOT NULL, email LONGTEXT NOT NULL, phone LONGTEXT NOT NULL, creation_date DATETIME NOT NULL, uuid CHAR(36) NOT NULL COMMENT \'(DC2Type:guid)\', UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE advertisements ADD CONSTRAINT FK_5C755F1E979B1AD6 FOREIGN KEY (company_id) REFERENCES companies (id)');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_F7C966F0A76ED395 FOREIGN KEY (user_id) REFERENCES people (id)');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_F7C966F0BE04EA9 FOREIGN KEY (job_id) REFERENCES advertisements (id)');
        $this->addSql('ALTER TABLE applications_no_user ADD CONSTRAINT FK_6654BDFBE04EA9 FOREIGN KEY (job_id) REFERENCES advertisements (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE advertisements DROP FOREIGN KEY FK_5C755F1E979B1AD6');
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_F7C966F0A76ED395');
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_F7C966F0BE04EA9');
        $this->addSql('ALTER TABLE applications_no_user DROP FOREIGN KEY FK_6654BDFBE04EA9');
        $this->addSql('DROP TABLE advertisements');
        $this->addSql('DROP TABLE applications');
        $this->addSql('DROP TABLE applications_no_user');
        $this->addSql('DROP TABLE companies');
        $this->addSql('DROP TABLE people');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
