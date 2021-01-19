 -- use Megans_Database;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
DROP TABLE IF EXISTS `WOD`;
DROP TABLE IF EXISTS `WODMovements`;
DROP TABLE IF EXISTS `MovementType`;
DROP TABLE IF EXISTS `Equipment`;

--
-- Table structure for table `WOD`
--
DROP TABLE IF EXISTS `WOD`;

CREATE TABLE `WOD` (
  `WOD_id` int(11) NOT NULL,
  `WOD_name` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `movement_1` varchar(255) NOT NULL,
  `movement_2` varchar(255),
  `movement_3` varchar(255),
  UNIQUE KEY `WOD_name` (`WOD_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `WOD` (`WOD_id`, `WOD_name`, `time`, `movement_1`, `movement_2`, `movement_3` ) VALUES
(1, "CINDY", 20, "5 Pull Ups", "10 Push Ups", "15 Air Squats"),
(2, "HAVANA", 25, "150 Double Unders", "50 Push Ups", "15 Power Cleans (185 / 125 lbs)"),
(3, "MEGAN", 12, "25 Meter Handstand Walk", "20 Double Unders", "25 Air Squats"); 

-- --------------------------------------------------------

--
-- Table structure for table `Equipment`
--
DROP TABLE IF EXISTS `Equipment`;

CREATE TABLE `Equipment` (
  `equipment_id` int(11) NOT NULL,
  `equipment_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Equipment`
--

INSERT INTO `Equipment` (`equipment_id`, `equipment_name`) VALUES
(1, 'Bodyweight'),
(2, 'Barbell'),
(3, 'Dumbbells'),
(4, 'Kettlebell'),
(5, 'Pull up bar'),
(6, 'Rings'),
(7, 'Rowing Machine'),
(8, 'Bike'),
(9, 'Jump Rope'),
(10, 'Medicine Ball'),
(11, 'Ab Mat'),
(12, 'Box');

-- --------------------------------------------------------

--
-- Table structure for table `MovementType`
--
DROP TABLE IF EXISTS `MovementType`;

CREATE TABLE `MovementType` (
  `move_type_id` int(11) NOT NULL,
  `move_type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `MovementType`
--

INSERT INTO `MovementType` (`move_type_id`, `move_type_name`) VALUES
(1, 'Push'),
(2, 'Pull'),
(3, 'Abs'),
(4, 'Legs'),
(5, 'Cardio'); 

-- --------------------------------------------------------

--
-- Table structure for table `WODMovements`
--
DROP TABLE IF EXISTS `WODMovements`;

CREATE TABLE `WODMovements` (
  `movement_id` int(11) NOT NULL,
  `movement_name` varchar(255) NOT NULL,
  `move_type_id` int(11) DEFAULT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `movement_weight` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `WODMovements`
--

INSERT INTO `WODMovements` (`movement_id`, `movement_name`, `move_type_id`, `equipment_id`, `movement_weight`) VALUES
(1, 'Run', 5, 1, "0"),
(2, 'Bike', 5, 8, "0"),
(3, 'Row', 5, 7, "0"),
(4, 'Double Unders', 5, 9, "0"),
(5, 'Deadlifts', 4, 2, "155 / 105"),
(6, 'Power Cleans', 2, 2, "95 / 65"),
(7, 'Cleans', 4, 2, "95 / 65"),
(8, 'Front Squat', 4, 2, "95 / 65"),
(9, 'Barbell Shoulder to Overhead', 1, 2, "95 / 65"),
(10, 'Dumbbell Shoulder to Overhead', 1, 3, "50 / 35"),
(11, 'Power Snatch', 2, 2, "85 / 55"),
(12, 'Overhead Squat', 4, 2, "85 / 55"),
(13, 'Barbell Thrusters', 4, 2, "85 / 55"),
(14, 'Dumbbell Thrusters', 4, 3, "50 / 35"),
(15, 'American Kettlebell Swings', 2, 4, "54 / 35"),
(16, 'Russian Kettlebell Swings', 2, 4, "54 / 35"),
(17, 'Dumbbell Snatches', 4, 3, "50 / 35"),
(18, 'Sumo Deadlift High Pulls', 4, 4, "50 / 35"),
(19, 'Kettlebell Front Squats', 4, 4, "54 / 35"),
(20, 'Push Ups', 1, 1, "0"),
(21, 'Handstand / Hand Release Push Ups', 1, 11, "0"),
(22, 'Handstand Hold', 1, 1, "0"),
(23, 'Handstand Walk / Bear Crawl', 1, 1, "0"),
(24, 'Pull Ups', 2, 5, "0"),
(25, 'Ring Rows', 2, 6, "0"),
(26, 'Barbell Bent Over Rows', 2, 2, "95 / 65"),
(27, 'Dumbbell Bent Over Rows', 2, 3, "50 / 35"),
(28, 'Kettlebell Bent Over Rows', 2, 4, "54 / 35"),
(29, 'Chest to Bar Pullups', 2, 5, "0"),
(30, 'Bar Muscle Ups', 2, 5, "0"),
(31, 'Ring Muscle Ups', 2, 6, "0"),
(32, 'Wall Ball Tosses', 4, 10, "20 / 14"),
(33, 'Medicine Ball Cleans', 4, 10, "20 / 14"),
(34, 'Dumbbell Cleans', 4, 3, "50 / 35"),
(35, 'Burpees', 5, 1, "0"),
(36, 'Air Squats', 4, 1, "0"),
(37, 'Medicine Ball Russian Twist', 3, 10, "20 / 14"),
(38, 'Kettlebell Russian Twist', 3, 4, "44 / 26"),
(39, 'Toes to Bar', 3, 5, "0"),
(40, 'Butterfly Sit Ups', 3, 11, "0"),
(41, 'Bar Facing Burpees', 5, 2, "0"),
(42, 'Box Jumps', 4, 12, "0"),
(43, 'Box Jump Overs', 4, 12, "0"),
(44, 'Burpee Box Jump Overs', 4, 12, "0"),
(45, 'Box Step Ups', 4, 12, "0"),
(46, 'Pistol Squats', 4, 1, "0"),
(47, 'Dual Dumbbell Farmers Carry', 3, 3, "50 / 35"),
(48, 'Kettlebell Farmers Carry', 3, 4, "54 / 35"),
(49, 'Dumbbell Overhead Carry', 3, 3, "50 / 35"),
(50, 'Kettlebell Overhead Carry', 3, 4, "54 / 35"),
(51, 'Toes to Rings', 2, 6, "0"),
(52, 'Single Dumbbell Farmers Carry', 3, 3, "50 / 35"),
(53, 'Plank Hold', 3, 1, "0");


-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `WOD`
--
ALTER TABLE `WOD`
  ADD PRIMARY KEY (`WOD_id`);

--
-- Indexes for table `Equipment`
--
ALTER TABLE `Equipment`
  ADD PRIMARY KEY (`equipment_id`);

--
-- Indexes for table `MovementType`
--
ALTER TABLE `MovementType`
  ADD PRIMARY KEY (`move_type_id`);

--
-- Indexes for table `WODMovements` 
--
ALTER TABLE `WODMovements`
  ADD PRIMARY KEY (`movement_id`),
  ADD KEY `move_type_id` (`move_type_id`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `WOD`
--
ALTER TABLE `WOD`
  MODIFY `WOD_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `Equipment`
--
ALTER TABLE `Equipment`
  MODIFY `equipment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `MovementType`
--
ALTER TABLE `MovementType`
  MODIFY `move_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `WODMovements`
--
ALTER TABLE `WODMovements`
  MODIFY `movement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `WOD`
--
ALTER TABLE `WOD`
  MODIFY `WOD_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for table `WODMovements`
--
ALTER TABLE `WODMovements`
  ADD CONSTRAINT `Movements_fk_1` FOREIGN KEY (`move_type_id`) REFERENCES `MovementType` (`move_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Movements_fk_2` FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;


