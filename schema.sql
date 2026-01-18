
-- Database Schema for Dianji Handyman Services App

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    avatar_url TEXT,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Services Table (Categories)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon_class VARCHAR(50), -- e.g., 'fa-faucet'
    theme_color VARCHAR(50), -- e.g., 'bg-blue-100 text-blue-600'
    description TEXT,
    base_price DECIMAL(10, 2) DEFAULT 0.00
);

-- 3. Handymen Table
CREATE TABLE handymen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    experience_years INTEGER,
    status VARCHAR(20) CHECK (status IN ('active', 'busy', 'offline')) DEFAULT 'active',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Handyman Specialties (Join Table)
CREATE TABLE handyman_specialties (
    handyman_id UUID REFERENCES handymen(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (handyman_id, service_id)
);

-- 5. Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    handyman_id UUID REFERENCES handymen(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Accepted', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AI Diagnosis Logs (For Admin Dashboard Insights)
CREATE TABLE ai_diagnosis_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_input TEXT NOT NULL,
    ai_diagnosis TEXT,
    detected_category VARCHAR(50),
    detected_urgency VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Insert Initial Data (Optional Seed Data)
INSERT INTO services (name, icon_class, theme_color, description) VALUES
('Plumbing', 'fa-faucet', 'bg-blue-100 text-blue-600', 'Fix leaks, faucets, and clogged drains.'),
('Electrical', 'fa-bolt', 'bg-yellow-100 text-yellow-600', 'Install fixtures, repair outlets, and wiring.'),
('Carpentry', 'fa-hammer', 'bg-orange-100 text-orange-600', 'Furniture repair and custom woodwork.'),
('Painting', 'fa-paint-roller', 'bg-pink-100 text-pink-600', 'Interior and exterior painting services.');
