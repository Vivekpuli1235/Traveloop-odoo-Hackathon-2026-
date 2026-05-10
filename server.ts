import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());

  // Database Connection
  const dbConfig = {
    host: "localhost",
    user: "root",
    password: "9848382300",
    database: "traveloop",
  };

  let pool: mysql.Pool;

  try {
    pool = mysql.createPool(dbConfig);
    console.log("Database connection pool created.");
    
    // Initialize Tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        photo LONGTEXT,
        interested_places TEXT,
        travel_interests TEXT,
        dream_places TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        cover_photo VARCHAR(255),
        is_public BOOLEAN DEFAULT FALSE,
        budget_flights DECIMAL(10,2) DEFAULT 0,
        budget_cabs DECIMAL(10,2) DEFAULT 0,
        budget_food DECIMAL(10,2) DEFAULT 0,
        budget_accommodation DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS stops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        city_name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        arrival_date DATE,
        departure_date DATE,
        order_index INT,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stop_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        time TIME,
        cost DECIMAL(10, 2) DEFAULT 0,
        category VARCHAR(50),
        FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS checklist_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        task VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        is_packed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS trip_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        content TEXT NOT NULL,
        stop_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables initialized.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API ROUTES ---

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result]: any = await pool.execute(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [email, hashedPassword, name]
      );
      const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET);
      res.json({ token, user: { id: result.insertId, email, name } });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const [rows]: any = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
      const user = rows[0];
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email, name: user.name } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User Profile
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const [rows]: any = await pool.execute("SELECT id, email, name, photo, interested_places, travel_interests, dream_places FROM users WHERE id = ?", [req.user.id]);
      res.json(rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/user/profile", authenticateToken, async (req: any, res) => {
    const { name, photo, interested_places, travel_interests, dream_places } = req.body;
    try {
      await pool.execute(
        "UPDATE users SET name = ?, photo = ?, interested_places = ?, travel_interests = ?, dream_places = ? WHERE id = ?",
        [name, photo, interested_places, travel_interests, dream_places, req.user.id]
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Trip Routes
  app.get("/api/trips", authenticateToken, async (req: any, res) => {
    try {
      const [rows]: any = await pool.execute("SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/trips", authenticateToken, async (req: any, res) => {
    const { name, description, start_date, end_date, budget_flights, budget_cabs, budget_food, budget_accommodation } = req.body;
    try {
      const [result]: any = await pool.execute(
        "INSERT INTO trips (user_id, name, description, start_date, end_date, budget_flights, budget_cabs, budget_food, budget_accommodation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [req.user.id, name, description, start_date, end_date, budget_flights || 0, budget_cabs || 0, budget_food || 0, budget_accommodation || 0]
      );
      res.json({ id: result.insertId, name, description, start_date, end_date, budget_flights, budget_cabs, budget_food, budget_accommodation });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/trips/:id", authenticateToken, async (req: any, res) => {
    try {
      const [tripRows]: any = await pool.execute("SELECT * FROM trips WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
      if (tripRows.length === 0) return res.status(404).json({ error: "Trip not found" });
      
      const [stops]: any = await pool.execute("SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index", [req.params.id]);
      
      // Get activities for all stops
      const tripWithDetails = { ...tripRows[0], stops: [] };
      for (const stop of stops) {
        const [activities]: any = await pool.execute("SELECT * FROM activities WHERE stop_id = ?", [stop.id]);
        tripWithDetails.stops.push({ ...stop, activities });
      }

      res.json(tripWithDetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Itinerary Construction
  app.post("/api/trips/:id/stops", authenticateToken, async (req: any, res) => {
    const { city_name, country, arrival_date, departure_date, order_index } = req.body;
    try {
      const [result]: any = await pool.execute(
        "INSERT INTO stops (trip_id, city_name, country, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?, ?)",
        [req.params.id, city_name, country, arrival_date, departure_date, order_index]
      );
      res.json({ id: result.insertId, city_name, country, arrival_date, departure_date, order_index });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/stops/:id/activities", authenticateToken, async (req: any, res) => {
    const { name, description, time, cost, category } = req.body;
    try {
      const [result]: any = await pool.execute(
        "INSERT INTO activities (stop_id, name, description, time, cost, category) VALUES (?, ?, ?, ?, ?, ?)",
        [req.params.id, name, description, time, cost, category]
      );
      res.json({ id: result.insertId, name, description, time, cost, category });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/trips/:id", authenticateToken, async (req: any, res) => {
    try {
      await pool.execute("DELETE FROM trips WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Checklist Routes
  app.get("/api/trips/:id/checklist", authenticateToken, async (req: any, res) => {
    try {
      const [rows]: any = await pool.execute("SELECT * FROM checklist_items WHERE trip_id = ?", [req.params.id]);
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/trips/:id/checklist", authenticateToken, async (req: any, res) => {
    const { task, category } = req.body;
    try {
      const [result]: any = await pool.execute(
        "INSERT INTO checklist_items (trip_id, task, category) VALUES (?, ?, ?)",
        [req.params.id, task, category]
      );
      res.json({ id: result.insertId, task, category, is_packed: false });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/checklist/:id", authenticateToken, async (req: any, res) => {
    const { is_packed } = req.body;
    try {
      await pool.execute("UPDATE checklist_items SET is_packed = ? WHERE id = ?", [is_packed, req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/checklist/:id", authenticateToken, async (req: any, res) => {
    try {
      await pool.execute("DELETE FROM checklist_items WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notes Routes
  app.get("/api/trips/:id/notes", authenticateToken, async (req: any, res) => {
    try {
      const [rows]: any = await pool.execute("SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC", [req.params.id]);
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/trips/:id/notes", authenticateToken, async (req: any, res) => {
    const { content, note_type, stop_id } = req.body;
    try {
      const [result]: any = await pool.execute(
        "INSERT INTO trip_notes (trip_id, content, note_type, stop_id) VALUES (?, ?, ?, ?)",
        [req.params.id, content, note_type || 'text', stop_id || null]
      );
      res.json({ id: result.insertId, content, note_type: note_type || 'text', stop_id: stop_id || null, created_at: new Date() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/notes/:id", authenticateToken, async (req: any, res) => {
    try {
      await pool.execute("DELETE FROM trip_notes WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public/Shared View
  app.get("/api/public/trips/:id", async (req, res) => {
    try {
      const [tripRows]: any = await pool.execute("SELECT * FROM trips WHERE id = ? AND is_public = TRUE", [req.params.id]);
      if (tripRows.length === 0) return res.status(404).json({ error: "Public trip not found" });
      
      const [stops]: any = await pool.execute("SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index", [req.params.id]);
      const tripWithDetails = { ...tripRows[0], stops: [] };
      for (const stop of stops) {
        const [activities]: any = await pool.execute("SELECT * FROM activities WHERE stop_id = ?", [stop.id]);
        tripWithDetails.stops.push({ ...stop, activities });
      }
      res.json(tripWithDetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Community Ratings
  app.get("/api/ratings/top", async (req, res) => {
    try {
      const [rows]: any = await pool.execute(`
        SELECT location_name, country_name, is_india, AVG(rating) as avg_rating, COUNT(*) as review_count, MAX(image_url) as image_url 
        FROM community_ratings 
        GROUP BY location_name, country_name, is_india 
        ORDER BY avg_rating DESC, review_count DESC 
        LIMIT 5
      `);
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ratings/community", async (req, res) => {
    try {
      const query = `
        SELECT c.*, u.name as reviewer_name 
        FROM community_ratings c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.is_india = ? 
        ORDER BY c.created_at DESC LIMIT 50
      `;
      const [indiaRows]: any = await pool.execute(query, [true]);
      const [internationalRows]: any = await pool.execute(query, [false]);
      res.json({ indian_cities: indiaRows, international_countries: internationalRows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ratings", authenticateToken, async (req: any, res) => {
    const { location_name, country_name, is_india, rating, review, image_url } = req.body;
    try {
      const [result]: any = await pool.execute(
        "INSERT INTO community_ratings (user_id, location_name, country_name, is_india, rating, review, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [req.user.id, location_name, country_name, is_india, rating, review, image_url || null]
      );
      res.json({ id: result.insertId, reviewer_name: req.user.name, location_name, country_name, is_india, rating, review, image_url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
