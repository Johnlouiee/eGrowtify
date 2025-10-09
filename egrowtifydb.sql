-- eGrowtify Database Schema
-- For XAMPP MySQL
-- Created for eGrowtify Plant Care Application

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS egrowtifydb;
CREATE DATABASE egrowtifydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE egrowtifydb;

-- Users table for user accounts
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    subscribed BOOLEAN DEFAULT FALSE,
    subscription_plan VARCHAR(20) DEFAULT 'basic',
    email_notifications BOOLEAN DEFAULT TRUE,
    learning_level VARCHAR(20) DEFAULT 'beginner',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admins table for administrator accounts
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Garden table for user gardens
CREATE TABLE garden (
    GARDEN_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID INT NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    GARDEN_TYPE VARCHAR(20) NOT NULL,
    LOCATION_CITY VARCHAR(100),
    LOCATION_COUNTRY VARCHAR(100),
    GRID_SIZE VARCHAR(10) DEFAULT '3x3', -- Current grid size (3x3 for basic, 6x6 for premium)
    BASE_GRID_SPACES INT DEFAULT 9, -- Base grid spaces from subscription plan (9 for basic, 36 for premium)
    ADDITIONAL_SPACES_PURCHASED INT DEFAULT 0, -- Additional spaces purchased beyond plan
    TOTAL_GRID_SPACES INT GENERATED ALWAYS AS (BASE_GRID_SPACES + ADDITIONAL_SPACES_PURCHASED) STORED, -- Total available grid spaces
    USED_GRID_SPACES INT DEFAULT 0, -- Currently used grid spaces (updated by triggers)
    CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plant table for plant database
CREATE TABLE plant (
    PLANT_ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    TYPE VARCHAR(20) NOT NULL,
    ENVIRONMENT VARCHAR(20) NOT NULL,
    CARE_GUIDE TEXT NOT NULL,
    IDEAL_SOIL_TYPE VARCHAR(100),
    WATERING_FREQUENCY INT,
    FERTILIZING_FREQUENCY INT,
    PRUNING_FREQUENCY INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grid Spaces table for tracking individual grid positions
CREATE TABLE grid_spaces (
    SPACE_ID INT AUTO_INCREMENT PRIMARY KEY,
    GARDEN_ID INT NOT NULL,
    GRID_POSITION VARCHAR(10) NOT NULL, -- Format: "row,column" (e.g., "1,1", "2,3")
    PLANT_ID INT,
    PLANTING_DATE DATE,
    LAST_WATERED DATE,
    LAST_FERTILIZED DATE,
    LAST_PRUNED DATE,
    NOTES TEXT,
    IS_ACTIVE BOOLEAN DEFAULT TRUE,
    CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GARDEN_ID) REFERENCES garden(GARDEN_ID) ON DELETE CASCADE,
    FOREIGN KEY (PLANT_ID) REFERENCES plant(PLANT_ID) ON DELETE SET NULL,
    UNIQUE KEY unique_garden_position (GARDEN_ID, GRID_POSITION)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PlantTracking table for tracking plant care (keeping for backward compatibility)
CREATE TABLE planttracking (
    TRACKING_ID INT AUTO_INCREMENT PRIMARY KEY,
    GARDEN_ID INT NOT NULL,
    PLANT_ID INT NOT NULL,
    PLANTING_DATE DATE NOT NULL,
    LAST_WATERED DATE,
    LAST_FERTILIZED DATE,
    LAST_PRUNED DATE,
    NOTES TEXT,
    FOREIGN KEY (GARDEN_ID) REFERENCES garden(GARDEN_ID) ON DELETE CASCADE,
    FOREIGN KEY (PLANT_ID) REFERENCES plant(PLANT_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feedback table for user feedback
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    rating INT DEFAULT 5,
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'pending',
    admin_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table for smart alerts
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    plant_id INT,
    garden_id INT,
    due_date DATETIME,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plant(PLANT_ID) ON DELETE SET NULL,
    FOREIGN KEY (garden_id) REFERENCES garden(GARDEN_ID) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscription Plans table
CREATE TABLE subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(50) UNIQUE NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    grid_planner_size VARCHAR(10) NOT NULL,
    free_ai_analyses INT NOT NULL,
    free_plant_analyses INT NOT NULL,
    free_soil_analyses INT NOT NULL,
    additional_grid_cost DECIMAL(10,2) DEFAULT 20.00,
    additional_ai_cost DECIMAL(10,2) DEFAULT 25.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Subscriptions table for tracking subscription details
CREATE TABLE user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    status VARCHAR(20) DEFAULT 'active',
    payment_status VARCHAR(20) DEFAULT 'pending',
    total_paid DECIMAL(10,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Usage Tracking table
CREATE TABLE ai_usage_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    usage_type VARCHAR(20) NOT NULL, -- 'plant_analysis', 'soil_analysis', 'grid_planner'
    image_path VARCHAR(500),
    analysis_result TEXT,
    cost DECIMAL(10,2) DEFAULT 0.00,
    is_free_usage BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment Transactions table
CREATE TABLE payment_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subscription_id INT,
    payment_method_id INT,
    transaction_type VARCHAR(30) NOT NULL, -- 'subscription', 'additional_grid', 'additional_ai', 'grid_space'
    amount DECIMAL(10,2) NOT NULL,
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    payment_status VARCHAR(20) DEFAULT 'pending',
    transaction_reference VARCHAR(100),
    description TEXT,
    grid_spaces_purchased INT DEFAULT 0, -- Number of additional grid spaces purchased
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample plants data
INSERT INTO plant (NAME, TYPE, ENVIRONMENT, CARE_GUIDE, IDEAL_SOIL_TYPE, WATERING_FREQUENCY, FERTILIZING_FREQUENCY, PRUNING_FREQUENCY) VALUES
('Tomato', 'Vegetable', 'Outdoor', 'Water regularly, full sun, well-draining soil. Stake plants for support. Remove suckers for better fruit production.', 'Well-draining', 2, 14, 7),
('Basil', 'Herb', 'Indoor', 'Keep soil moist, partial sun, rich soil. Pinch off flower buds to encourage leaf growth. Harvest regularly.', 'Rich soil', 1, 7, 3),
('Lettuce', 'Vegetable', 'Indoor', 'Keep cool, regular watering, loamy soil. Harvest outer leaves first. Plant in succession for continuous harvest.', 'Loamy soil', 1, 10, 5),
('Pepper', 'Vegetable', 'Outdoor', 'Full sun, regular watering, well-draining soil. Support heavy fruit with stakes. Harvest when fully colored.', 'Well-draining', 2, 14, 7),
('Mint', 'Herb', 'Indoor', 'Keep moist, partial shade, rich soil. Plant in containers to prevent spreading. Harvest leaves as needed.', 'Rich soil', 1, 7, 3),
('Carrot', 'Vegetable', 'Outdoor', 'Loose soil, regular watering, full sun. Thin seedlings for better root development. Harvest when roots are mature.', 'Sandy loam', 2, 21, 0),
('Spinach', 'Vegetable', 'Indoor', 'Cool temperature, regular watering, rich soil. Harvest outer leaves first. Plant in cool weather.', 'Rich soil', 1, 10, 0),
('Rosemary', 'Herb', 'Outdoor', 'Well-draining soil, full sun, moderate watering. Prune regularly to maintain shape. Drought tolerant once established.', 'Well-draining', 3, 21, 14),
('Cucumber', 'Vegetable', 'Outdoor', 'Full sun, regular watering, rich soil. Provide trellis for climbing. Harvest when young for best flavor.', 'Rich soil', 2, 14, 0),
('Parsley', 'Herb', 'Indoor', 'Partial sun, regular watering, rich soil. Harvest outer stems first. Biennial plant.', 'Rich soil', 1, 7, 0),
('Strawberry', 'Fruit', 'Outdoor', 'Full sun, regular watering, well-draining soil. Mulch to keep fruit clean. Remove runners for better fruit production.', 'Well-draining', 2, 14, 7),
('Lavender', 'Herb', 'Outdoor', 'Full sun, well-draining soil, moderate watering. Prune after flowering. Drought tolerant.', 'Well-draining', 3, 21, 14),
('Green Bean', 'Vegetable', 'Outdoor', 'Full sun, regular watering, well-draining soil. Support climbing varieties. Harvest when pods are young.', 'Well-draining', 2, 14, 0),
('Oregano', 'Herb', 'Outdoor', 'Full sun, well-draining soil, moderate watering. Prune regularly to prevent woody growth. Drought tolerant.', 'Well-draining', 3, 21, 7),
('Radish', 'Vegetable', 'Outdoor', 'Full sun, regular watering, loose soil. Quick growing crop. Harvest when roots are mature.', 'Loose soil', 1, 7, 0);

-- Insert subscription plans data
INSERT INTO subscription_plans (plan_name, plan_type, price, currency, grid_planner_size, free_ai_analyses, free_plant_analyses, free_soil_analyses, additional_grid_cost, additional_ai_cost) VALUES
('Premium Plan', 'premium', 150.00, 'PHP', '6x6', 20, 10, 10, 20.00, 25.00),
('Basic Plan', 'basic', 0.00, 'PHP', '3x3', 4, 2, 2, 20.00, 25.00);

-- Payment Methods table
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) UNIQUE NOT NULL,
    method_type VARCHAR(30) NOT NULL,
    is_priority BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert payment methods data
INSERT INTO payment_methods (method_name, method_type, is_priority, is_active, processing_fee, description) VALUES
('GCash', 'digital_wallet', TRUE, TRUE, 0.00, 'GCash - Priority payment method for fast and secure transactions'),
('PayMaya', 'digital_wallet', FALSE, TRUE, 0.00, 'PayMaya - Digital wallet payment option'),
('Credit Card', 'card', FALSE, TRUE, 5.00, 'Credit/Debit Card - Traditional card payment with processing fee'),
('Debit Card', 'card', FALSE, TRUE, 3.00, 'Debit Card - Direct bank account payment with processing fee');

-- Insert default admin account (password: admin123)
INSERT INTO admins (username, email, password_hash, full_name, is_super_admin) VALUES
('admin', 'admin@egrowtify.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'System Administrator', TRUE);

-- Insert sample user accounts (password: testpass123)
INSERT INTO users (email, firstname, lastname, contact, password_hash, role, subscription_plan, subscribed) VALUES
('john.doe@example.com', 'John', 'Doe', '1234567890', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'user', 'premium', TRUE),
('jane.smith@example.com', 'Jane', 'Smith', '0987654321', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'user', 'basic', FALSE),
('mike.wilson@example.com', 'Mike', 'Wilson', '5551234567', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'user', 'basic', FALSE);

-- Insert sample gardens with grid planner data
INSERT INTO garden (USER_ID, NAME, GARDEN_TYPE, LOCATION_CITY, LOCATION_COUNTRY, GRID_SIZE, BASE_GRID_SPACES, ADDITIONAL_SPACES_PURCHASED, USED_GRID_SPACES) VALUES
(1, 'Backyard Vegetable Garden', 'Outdoor', 'New York', 'USA', '6x6', 36, 0, 8), -- Premium user with 6x6 grid
(1, 'Kitchen Herb Garden', 'Indoor', 'New York', 'USA', '6x6', 36, 0, 4), -- Premium user with 6x6 grid
(1, 'Expanded Greenhouse', 'Indoor', 'New York', 'USA', '6x6', 36, 5, 0), -- Premium user with 6x6 grid + 5 additional spaces
(2, 'Balcony Garden', 'Outdoor', 'Los Angeles', 'USA', '3x3', 9, 2, 3), -- Basic user with 3x3 grid + 2 additional spaces
(2, 'Expanded Balcony', 'Outdoor', 'Los Angeles', 'USA', '3x3', 9, 5, 0), -- Basic user with 3x3 grid + 5 additional spaces
(3, 'Greenhouse Garden', 'Indoor', 'Chicago', 'USA', '3x3', 9, 0, 1); -- Basic user with 3x3 grid

-- Add triggers to automatically update used_grid_spaces when plants are added/removed
DELIMITER //
CREATE TRIGGER update_used_spaces_after_insert
AFTER INSERT ON grid_spaces
FOR EACH ROW
BEGIN
    UPDATE garden 
    SET USED_GRID_SPACES = (
        SELECT COUNT(*) 
        FROM grid_spaces 
        WHERE GARDEN_ID = NEW.GARDEN_ID AND IS_ACTIVE = TRUE
    )
    WHERE GARDEN_ID = NEW.GARDEN_ID;
END//

CREATE TRIGGER update_used_spaces_after_update
AFTER UPDATE ON grid_spaces
FOR EACH ROW
BEGIN
    UPDATE garden 
    SET USED_GRID_SPACES = (
        SELECT COUNT(*) 
        FROM grid_spaces 
        WHERE GARDEN_ID = NEW.GARDEN_ID AND IS_ACTIVE = TRUE
    )
    WHERE GARDEN_ID = NEW.GARDEN_ID;
END//

CREATE TRIGGER update_used_spaces_after_delete
AFTER DELETE ON grid_spaces
FOR EACH ROW
BEGIN
    UPDATE garden 
    SET USED_GRID_SPACES = (
        SELECT COUNT(*) 
        FROM grid_spaces 
        WHERE GARDEN_ID = OLD.GARDEN_ID AND IS_ACTIVE = TRUE
    )
    WHERE GARDEN_ID = OLD.GARDEN_ID;
END//
DELIMITER ;

-- Add function to validate grid space purchase
DELIMITER //
CREATE FUNCTION can_purchase_grid_spaces(
    p_garden_id INT,
    p_spaces_to_purchase INT
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE current_total INT;
    DECLARE max_allowed INT DEFAULT 100; -- Maximum grid spaces allowed per garden
    
    SELECT TOTAL_GRID_SPACES INTO current_total
    FROM garden 
    WHERE GARDEN_ID = p_garden_id;
    
    -- Check if adding spaces would exceed maximum allowed
    IF (current_total + p_spaces_to_purchase) > max_allowed THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END//
DELIMITER ;

-- Insert sample grid spaces data
INSERT INTO grid_spaces (GARDEN_ID, GRID_POSITION, PLANT_ID, PLANTING_DATE, LAST_WATERED, LAST_FERTILIZED, LAST_PRUNED, NOTES) VALUES
-- Premium user garden 1 (6x6 grid) - 8 plants
(1, '1,1', 1, '2024-03-15', '2024-03-20', '2024-03-15', '2024-03-18', 'Tomato - Row 1, Col 1'),
(1, '1,2', 1, '2024-03-15', '2024-03-20', '2024-03-15', '2024-03-18', 'Tomato - Row 1, Col 2'),
(1, '2,1', 4, '2024-03-10', '2024-03-19', '2024-03-10', '2024-03-17', 'Pepper - Row 2, Col 1'),
(1, '2,2', 4, '2024-03-10', '2024-03-19', '2024-03-10', '2024-03-17', 'Pepper - Row 2, Col 2'),
(1, '3,1', 6, '2024-03-12', '2024-03-19', '2024-03-12', NULL, 'Carrot - Row 3, Col 1'),
(1, '3,2', 6, '2024-03-12', '2024-03-19', '2024-03-12', NULL, 'Carrot - Row 3, Col 2'),
(1, '4,1', 9, '2024-03-08', '2024-03-18', '2024-03-08', '2024-03-15', 'Cucumber - Row 4, Col 1'),
(1, '4,2', 9, '2024-03-08', '2024-03-18', '2024-03-08', '2024-03-15', 'Cucumber - Row 4, Col 2'),
-- Premium user garden 2 (6x6 grid) - 4 plants
(2, '1,1', 2, '2024-02-28', '2024-03-20', '2024-03-13', '2024-03-15', 'Basil - Row 1, Col 1'),
(2, '1,2', 2, '2024-02-28', '2024-03-20', '2024-03-13', '2024-03-15', 'Basil - Row 1, Col 2'),
(2, '2,1', 5, '2024-03-01', '2024-03-19', '2024-03-08', '2024-03-12', 'Mint - Row 2, Col 1'),
(2, '2,2', 5, '2024-03-01', '2024-03-19', '2024-03-08', '2024-03-12', 'Mint - Row 2, Col 2'),
-- Basic user garden 3 (3x3 grid + 2 additional spaces) - 5 plants total
(3, '1,1', 3, '2024-03-05', '2024-03-20', '2024-03-12', '2024-03-15', 'Lettuce - Row 1, Col 1'),
(3, '1,2', 3, '2024-03-05', '2024-03-20', '2024-03-12', '2024-03-15', 'Lettuce - Row 1, Col 2'),
(3, '2,1', 3, '2024-03-05', '2024-03-20', '2024-03-12', '2024-03-15', 'Lettuce - Row 2, Col 1'),
(3, '4,1', 7, '2024-03-08', '2024-03-19', '2024-03-08', NULL, 'Spinach - Additional space 1'),
(3, '4,2', 7, '2024-03-08', '2024-03-19', '2024-03-08', NULL, 'Spinach - Additional space 2'),
-- Basic user garden 4 (3x3 grid) - 1 plant
(4, '1,1', 8, '2024-02-15', '2024-03-18', '2024-03-01', '2024-03-10', 'Rosemary - Row 1, Col 1');

-- Insert sample plant tracking data (keeping for backward compatibility)
INSERT INTO planttracking (GARDEN_ID, PLANT_ID, PLANTING_DATE, LAST_WATERED, LAST_FERTILIZED, LAST_PRUNED, NOTES) VALUES
(1, 1, '2024-03-15', '2024-03-20', '2024-03-15', '2024-03-18', 'Tomatoes growing well, need staking soon'),
(1, 4, '2024-03-10', '2024-03-19', '2024-03-10', '2024-03-17', 'Peppers showing good growth'),
(2, 2, '2024-02-28', '2024-03-20', '2024-03-13', '2024-03-15', 'Basil ready for first harvest'),
(2, 5, '2024-03-01', '2024-03-19', '2024-03-08', '2024-03-12', 'Mint spreading nicely'),
(3, 3, '2024-03-05', '2024-03-20', '2024-03-12', '2024-03-15', 'Lettuce ready for harvest'),
(4, 8, '2024-02-15', '2024-03-18', '2024-03-01', '2024-03-10', 'Rosemary established well');

-- Insert sample feedback
INSERT INTO feedback (user_id, subject, message, rating, category, status) VALUES
(1, 'Great AI Recognition Feature', 'The plant recognition feature is incredibly accurate and helpful for identifying unknown plants in my garden.', 5, 'feature', 'resolved'),
(2, 'Smart Alerts Working Perfectly', 'The notification system reminds me exactly when to water and fertilize my plants. Very reliable!', 5, 'feature', 'resolved'),
(3, 'User Interface Suggestion', 'Would love to see a dark mode option for the mobile app. Otherwise, everything works great.', 4, 'ui', 'pending');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, plant_id, garden_id, due_date, priority) VALUES
(1, 'watering', 'Water Your Tomatoes', 'Your tomatoes in Backyard Garden need watering today.', 1, 1, '2024-03-21 09:00:00', 'high'),
(1, 'fertilizing', 'Fertilize Your Basil', 'Time to fertilize your basil plants in Kitchen Herb Garden.', 2, 2, '2024-03-22 10:00:00', 'medium'),
(2, 'pruning', 'Prune Your Mint', 'Your mint plants need pruning to encourage new growth.', 5, 2, '2024-03-23 14:00:00', 'low'),
(3, 'watering', 'Water Your Lettuce', 'Your lettuce in Balcony Garden needs watering.', 3, 3, '2024-03-21 08:00:00', 'high');

-- Insert sample user subscriptions
INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, status, payment_status, total_paid) VALUES
(1, 1, '2024-03-01 00:00:00', '2024-04-01 00:00:00', 'active', 'paid', 150.00),
(2, 2, '2024-03-15 00:00:00', NULL, 'active', 'free', 0.00),
(3, 2, '2024-03-10 00:00:00', NULL, 'active', 'free', 0.00);

-- Insert sample AI usage tracking
INSERT INTO ai_usage_tracking (user_id, usage_type, image_path, analysis_result, cost, is_free_usage) VALUES
(1, 'plant_analysis', '/uploads/plants/tomato_1.jpg', 'Tomato plant - healthy, needs watering', 0.00, TRUE),
(1, 'plant_analysis', '/uploads/plants/basil_1.jpg', 'Basil plant - ready for harvest', 0.00, TRUE),
(1, 'soil_analysis', '/uploads/soil/garden_soil_1.jpg', 'Well-draining soil, pH 6.5', 0.00, TRUE),
(2, 'plant_analysis', '/uploads/plants/lettuce_1.jpg', 'Lettuce plant - good growth', 0.00, TRUE),
(2, 'plant_analysis', '/uploads/plants/mint_1.jpg', 'Mint plant - needs pruning', 0.00, TRUE),
(2, 'plant_analysis', '/uploads/plants/pepper_1.jpg', 'Pepper plant - flowering stage', 25.00, FALSE),
(3, 'plant_analysis', '/uploads/plants/carrot_1.jpg', 'Carrot plant - root development', 0.00, TRUE),
(3, 'soil_analysis', '/uploads/soil/balcony_soil_1.jpg', 'Sandy soil, needs nutrients', 0.00, TRUE);

-- Insert sample payment transactions
INSERT INTO payment_transactions (user_id, subscription_id, payment_method_id, transaction_type, amount, processing_fee, total_amount, currency, payment_status, transaction_reference, description, grid_spaces_purchased) VALUES
(1, 1, 1, 'subscription', 150.00, 0.00, 150.00, 'PHP', 'completed', 'TXN_001', 'Premium Plan subscription for March 2024 - Paid via GCash', 0),
(2, 2, 1, 'additional_ai', 25.00, 0.00, 25.00, 'PHP', 'completed', 'TXN_002', 'Additional AI plant analysis - Pepper plant - Paid via GCash', 0),
(2, 2, 1, 'grid_space', 40.00, 0.00, 40.00, 'PHP', 'completed', 'TXN_003', 'Purchase 2 additional grid spaces for Balcony Garden - Paid via GCash', 2),
(2, 2, 1, 'grid_space', 100.00, 0.00, 100.00, 'PHP', 'completed', 'TXN_004', 'Purchase 5 additional grid spaces for Expanded Balcony - Paid via GCash', 5),
(1, 1, 1, 'grid_space', 100.00, 0.00, 100.00, 'PHP', 'completed', 'TXN_005', 'Purchase 5 additional grid spaces for Expanded Greenhouse - Paid via GCash', 5),
(3, 3, 2, 'additional_grid', 20.00, 0.00, 20.00, 'PHP', 'pending', 'TXN_006', 'Upgrade to 4x4 grid planner - PayMaya payment', 0),
(1, 1, 3, 'subscription', 150.00, 5.00, 155.00, 'PHP', 'completed', 'TXN_007', 'Premium Plan subscription renewal - Credit Card with processing fee', 0);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX idx_garden_user_id ON garden(USER_ID);
CREATE INDEX idx_garden_grid_size ON garden(GRID_SIZE);
CREATE INDEX idx_grid_spaces_garden_id ON grid_spaces(GARDEN_ID);
CREATE INDEX idx_grid_spaces_plant_id ON grid_spaces(PLANT_ID);
CREATE INDEX idx_grid_spaces_position ON grid_spaces(GRID_POSITION);
CREATE INDEX idx_grid_spaces_active ON grid_spaces(IS_ACTIVE);
CREATE INDEX idx_planttracking_garden_id ON planttracking(GARDEN_ID);
CREATE INDEX idx_planttracking_plant_id ON planttracking(PLANT_ID);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_due_date ON notifications(due_date);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_ai_usage_tracking_user_id ON ai_usage_tracking(user_id);
CREATE INDEX idx_ai_usage_tracking_usage_type ON ai_usage_tracking(usage_type);
CREATE INDEX idx_ai_usage_tracking_created_at ON ai_usage_tracking(created_at);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_subscription_id ON payment_transactions(subscription_id);
CREATE INDEX idx_payment_transactions_payment_method_id ON payment_transactions(payment_method_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(payment_status);
CREATE INDEX idx_payment_transactions_type ON payment_transactions(transaction_type);
CREATE INDEX idx_payment_methods_is_priority ON payment_methods(is_priority);
CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);

-- Show table creation confirmation
SELECT 'eGrowtify Database Created Successfully!' as message;
SELECT COUNT(*) as total_plants FROM plant;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_gardens FROM garden;
SELECT COUNT(*) as total_grid_spaces FROM grid_spaces;
SELECT COUNT(*) as total_subscription_plans FROM subscription_plans;
SELECT COUNT(*) as total_user_subscriptions FROM user_subscriptions;
SELECT COUNT(*) as total_ai_usage_records FROM ai_usage_tracking;
SELECT COUNT(*) as total_payment_transactions FROM payment_transactions;
SELECT COUNT(*) as total_payment_methods FROM payment_methods;
