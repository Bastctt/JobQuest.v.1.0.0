<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241009085752 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE applications MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_F7C966F07E182327');
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_F7C966F09D86650F');
        $this->addSql('DROP INDEX IDX_F7C966F09D86650F ON applications');
        $this->addSql('DROP INDEX IDX_F7C966F07E182327 ON applications');
        $this->addSql('DROP INDEX `primary` ON applications');
        $this->addSql('ALTER TABLE applications ADD user_id INT NOT NULL, ADD job_id INT NOT NULL, DROP id, DROP user_id_id, DROP job_id_id');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_F7C966F0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_F7C966F0BE04EA9 FOREIGN KEY (job_id) REFERENCES jobs (id)');
        $this->addSql('CREATE INDEX IDX_F7C966F0A76ED395 ON applications (user_id)');
        $this->addSql('CREATE INDEX IDX_F7C966F0BE04EA9 ON applications (job_id)');
        $this->addSql('ALTER TABLE applications ADD PRIMARY KEY (user_id, job_id)');
        $this->addSql('ALTER TABLE jobs ADD company_id INT NOT NULL, ADD description LONGTEXT NOT NULL');
        $this->addSql('ALTER TABLE jobs ADD CONSTRAINT FK_A8936DC5979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id)');
        $this->addSql('CREATE INDEX IDX_A8936DC5979B1AD6 ON jobs (company_id)');
        $this->addSql('ALTER TABLE user ADD is_active TINYINT(1) DEFAULT 1 NOT NULL, ADD email LONGTEXT NOT NULL, ADD tel LONGTEXT NOT NULL, ADD creation_date DATETIME NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_F7C966F0A76ED395');
        $this->addSql('ALTER TABLE applications DROP FOREIGN KEY FK_F7C966F0BE04EA9');
        $this->addSql('DROP INDEX IDX_F7C966F0A76ED395 ON applications');
        $this->addSql('DROP INDEX IDX_F7C966F0BE04EA9 ON applications');
        $this->addSql('ALTER TABLE applications ADD id INT AUTO_INCREMENT NOT NULL, ADD user_id_id INT DEFAULT NULL, ADD job_id_id INT DEFAULT NULL, DROP user_id, DROP job_id, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_F7C966F07E182327 FOREIGN KEY (job_id_id) REFERENCES jobs (id)');
        $this->addSql('ALTER TABLE applications ADD CONSTRAINT FK_F7C966F09D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_F7C966F09D86650F ON applications (user_id_id)');
        $this->addSql('CREATE INDEX IDX_F7C966F07E182327 ON applications (job_id_id)');
        $this->addSql('ALTER TABLE jobs DROP FOREIGN KEY FK_A8936DC5979B1AD6');
        $this->addSql('DROP INDEX IDX_A8936DC5979B1AD6 ON jobs');
        $this->addSql('ALTER TABLE jobs DROP company_id, DROP description');
        $this->addSql('ALTER TABLE user DROP is_active, DROP email, DROP tel, DROP creation_date');
    }
}
