import express from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js"; // Import the database connection

const router = express.Router();


//get
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies'); 
    res.status(200).json(result.rows);  JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//get by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Movie not found");
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//post
router.post("/", async (req, res) => {
  const { movie_Name, description, casting } = req.body;
  if (!movie_Name || !description || !casting) {
    return res.status(400).send({ message: "All fields are required" });
  }
  const Id = uuidv4(); 
  try {
    const result = await pool.query(
      "INSERT INTO movies (id, Movie_Name, Description, Casting) VALUES ($1, $2, $3, $4) RETURNING *",
      [movie_Name, description, casting, Id]
    );
    res.json({ message: "Movie added successfully", movie: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteResult.rows.length === 0) {
      return res.status(404).send("Movie not found");
    }
    const updatedMovies = await pool.query("SELECT * FROM movies");
    res.json(updatedMovies.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

//patch
router.patch("/:id", async (req, res) => {
  const { movie_Name, description, casting } = req.body;
  const id = req.params.id;
  if (!movie_Name || !description || !casting) {
    return res.status(400).send({ message: "All fields are required" });
  }
  try {
    const result = await pool.query(
      "UPDATE movies SET Movie_Name = $1, Description = $2, Casting = $3 WHERE id = $4 RETURNING *",
      [movie_Name, description, casting, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: "Movie not found" });
    }

    res.json({ message: "Movie updated successfully", movie: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Movie_Name, Description, Casting } = req.body;
  if (!Movie_Name || !Description || !Casting) {
    return res
      .status(400)
      .send(
        "Please provide all required fields (Movie_Name, Description, Casting)."
      );
  }
  try {
    const checkMovie = await pool.query("SELECT * FROM movies WHERE id = $1", [
      id,
    ]);
    if (checkMovie.rows.length === 0) {
      return res.status(404).send("Movie not found");
    }

    // Replace the existing movie
    const result = await pool.query(
      `UPDATE movies 
       SET Movie_Name = $1, 
           Description = $2, 
           Casting = $3
       WHERE id = $4 
       RETURNING *`,
      [Movie_Name, Description, Casting, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
