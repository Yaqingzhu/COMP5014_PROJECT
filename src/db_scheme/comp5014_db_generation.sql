-- MySQL Script generated by MySQL Workbench
-- Fri Oct 30 23:09:43 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`academic`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`academic` ;

CREATE TABLE IF NOT EXISTS `mydb`.`academic` (
  `registration_deadline` DATETIME NOT NULL,
  `drop_deadline` DATETIME NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`admin` ;

CREATE TABLE IF NOT EXISTS `mydb`.`admin` (
  `admin_id` INT NOT NULL,
  PRIMARY KEY (`admin_id`),
  CONSTRAINT `fk_admin_login`
    FOREIGN KEY (`admin_id`)
    REFERENCES `mydb`.`login` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`course` ;

CREATE TABLE IF NOT EXISTS `mydb`.`course` (
  `course_id` INT NOT NULL,
  `course_name` VARCHAR(45) NOT NULL,
  `course_status` VARCHAR(45) NOT NULL,
  `course_assigned_prof_id` INT NULL,
  `course_capacity` INT NULL,
  `course_slots_id` VARCHAR(45) NULL,
  PRIMARY KEY (`course_id`),
  INDEX `fk_course_prof_idx` (`course_assigned_prof_id` ASC) VISIBLE,
  CONSTRAINT `fk_course_prof`
    FOREIGN KEY (`course_assigned_prof_id`)
    REFERENCES `mydb`.`prof` (`prof_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`course_slots`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`course_slots` ;

CREATE TABLE IF NOT EXISTS `mydb`.`course_slots` (
  `course_id` INT NOT NULL,
  `course_slots_day` INT NOT NULL,
  `course_slots_time` TIME NOT NULL,
  INDEX `fk_course_slots_course_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_course_slots_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`deliverable`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`deliverable` ;

CREATE TABLE IF NOT EXISTS `mydb`.`deliverable` (
  `deliverable_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `deliverable_type` VARCHAR(45) NOT NULL,
  `deliverable_deadline` DATETIME NOT NULL,
  PRIMARY KEY (`deliverable_id`),
  INDEX `fk_deliverable_course_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_deliverable_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`login`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`login` ;

CREATE TABLE IF NOT EXISTS `mydb`.`login` (
  `id` INT NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`preclusions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`preclusions` ;

CREATE TABLE IF NOT EXISTS `mydb`.`preclusions` (
  `course_id` INT NOT NULL,
  `preclusions_course_id` INT NOT NULL,
  INDEX `fk_preclusions_cours2_idx` (`preclusions_course_id` ASC) VISIBLE,
  CONSTRAINT `fk_preclusions_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_preclusions_cours2`
    FOREIGN KEY (`preclusions_course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`prerequisites`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`prerequisites` ;

CREATE TABLE IF NOT EXISTS `mydb`.`prerequisites` (
  `course_id` INT NOT NULL,
  `prerequisites_course_id` INT NOT NULL,
  INDEX `fk_prerequisites_cours2_idx` (`prerequisites_course_id` ASC) VISIBLE,
  CONSTRAINT `fk_prerequisites_course1`
    FOREIGN KEY (`course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_prerequisites_cours2`
    FOREIGN KEY (`prerequisites_course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`prof`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`prof` ;

CREATE TABLE IF NOT EXISTS `mydb`.`prof` (
  `prof_id` INT NOT NULL,
  `prof_name` VARCHAR(45) NOT NULL,
  `login_password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`prof_id`),
  CONSTRAINT `fk_prof_login`
    FOREIGN KEY (`prof_id`)
    REFERENCES `mydb`.`login` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`registration`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`registration` ;

CREATE TABLE IF NOT EXISTS `mydb`.`registration` (
  `registration_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `registration_date` DATETIME NOT NULL,
  `drop_date` DATETIME NULL,
  `late_registration` TINYINT NOT NULL,
  `late_registration_approval` TINYINT NULL,
  `late_drop` TINYINT NOT NULL,
  `late_drop_approval` TINYINT NULL,
  `final_grade` VARCHAR(45) NOT NULL DEFAULT 'N/A',
  INDEX `fk_registration_course_idx` (`course_id` ASC) VISIBLE,
  INDEX `fk_registration_student_idx` (`student_id` ASC) VISIBLE,
  PRIMARY KEY (`registration_id`),
  CONSTRAINT `fk_registration_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `mydb`.`course` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_registration_student`
    FOREIGN KEY (`student_id`)
    REFERENCES `mydb`.`student` (`student_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`student` ;

CREATE TABLE IF NOT EXISTS `mydb`.`student` (
  `student_id` INT NOT NULL,
  `student_name` VARCHAR(45) NOT NULL,
  `student_email` VARCHAR(45) NOT NULL,
  `admitted` TINYINT NOT NULL DEFAULT 0,
  `birth_date` DATE NOT NULL,
  PRIMARY KEY (`student_id`),
  CONSTRAINT `fk_student_login`
    FOREIGN KEY (`student_id`)
    REFERENCES `mydb`.`login` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`submitation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`submitation` ;

CREATE TABLE IF NOT EXISTS `mydb`.`submitation` (
  `submitation_id` INT NOT NULL,
  `registration_id` INT NOT NULL,
  `deliverable_id` INT NOT NULL,
  `submitation_date` DATETIME NOT NULL,
  `submitation_file` BLOB NULL,
  `submitation_grade` INT NULL,
  PRIMARY KEY (`submitation_id`),
  INDEX `fk_submitation_registration_idx` (`registration_id` ASC) VISIBLE,
  INDEX `fk_submitation_deliverable_idx` (`deliverable_id` ASC) VISIBLE,
  CONSTRAINT `fk_submitation_registration`
    FOREIGN KEY (`registration_id`)
    REFERENCES `mydb`.`registration` (`registration_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_submitation_deliverable`
    FOREIGN KEY (`deliverable_id`)
    REFERENCES `mydb`.`deliverable` (`deliverable_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
