/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

SET FOREIGN_KEY_CHECKS = 1;


DROP TABLE IF EXISTS `publicNews`;
CREATE TABLE `publicNews` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_from` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `article` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `further_info` varchar(1000) COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `association`;
CREATE TABLE `association` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_english` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_src` varchar(1000) COLLATE utf8mb4_unicode_ci,
  `intro` varchar(3000) COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `association_qq`;
CREATE TABLE `association_qq` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qq` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

DROP TABLE IF EXISTS `association_official`;
CREATE TABLE `association_official` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `official` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `association_joiner`;
CREATE TABLE `association_joiner` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `association_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `open_id` (`open_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `association_manager`;
CREATE TABLE `association_manager` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `association_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `identity` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `user_identity`;
CREATE TABLE `user_identity` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `association_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `identity` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DROP TABLE IF EXISTS `association_audit`;
CREATE TABLE `association_audit` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_english` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_src` varchar(1000) COLLATE utf8mb4_unicode_ci,
  `intro` varchar(3000) COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci