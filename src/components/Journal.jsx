import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundImage from '../assets/background.png';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  // Fetch journal entries from MongoDB
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/entries');
        setEntries(res.data);
      } catch (error) {
        console.error('Error fetching entries:', error.message);
      }
    };
    fetchEntries();
  }, []);

  // Add a new entry to MongoDB
  const addEntry = async (e) => {
    e.preventDefault();
    if (entry.trim() === '') return; // Prevent empty entries
    try {
      const res = await axios.post('http://localhost:5000/api/entries', { text: entry });
      setEntries([res.data, ...entries]); // Add new entry to UI
      setEntry('');
    } catch (error) {
      console.error('Error adding entry:', error.message);
    }
  };

  // Delete an entry from MongoDB
  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/entries/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id)); // Remove entry from UI
    } catch (error) {
      console.error('Error deleting entry:', error.message);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundImage:  `url(${backgroundImage})`, // Path to your image
        backgroundSize: 'cover', // Ensure the image covers the entire container
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Prevent repeating of the background
        height: '100vh', // Ensure the container takes full height
        padding: '20px', // Optional padding for your content
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        My Journal
      </Typography>

      {/* Entry Form */}
      <Box component="form" onSubmit={addEntry} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Write your journal entry..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Entry
        </Button>
      </Box>

      {/* Entries List */}
      <List>
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem
                sx={{
                  bgcolor: 'background.paper',
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText primary={entry.text} />
                <IconButton onClick={() => deleteEntry(entry._id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Container>
  );
};

export default Journal;