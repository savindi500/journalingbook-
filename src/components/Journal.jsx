import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Box, Grid, Paper } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundImage from '../assets/background.png';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingEntry, setIsAddingEntry] = useState(false);

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
      const res = await axios.post('http://localhost:5000/api/entries', { text: entry, date: selectedDate });
      setEntries([res.data, ...entries]); // Add new entry to UI
      setEntry('');
      setIsAddingEntry(false); // Close the add entry form
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

  // Handle date click in the calendar
  const handleDateClick = (date) => {
    setSelectedDate(date); // Set the selected date
    setIsAddingEntry(false); // Close the add entry form (optional)
  };

  // Filter entries for the selected date
  const filteredEntries = entries.filter(
    (e) => new Date(e.date).toDateString() === selectedDate.toDateString()
  );

  // Render the calendar
  const renderCalendar = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const days = [];

    // Add empty days for the first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const entryForDate = entries.find((e) => new Date(e.date).toDateString() === date.toDateString());
      days.push(
        <div
          key={i}
          onClick={() => handleDateClick(date)}
          style={{ cursor: 'pointer', fontWeight: date.toDateString() === selectedDate.toDateString() ? 'bold' : 'normal' }}
        >
          {i}
          {entryForDate && <div style={{ fontSize: '0.75rem', color: 'green' }}>•</div>}
        </div>
      );
    }

    return (
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6">{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</Typography>
        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Grid item xs key={day}>
              <Typography variant="subtitle2">{day}</Typography>
            </Grid>
          ))}
          {days.map((day, index) => (
            <Grid item xs key={index}>
              {day}
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddingEntry(true)}
          sx={{ mt: 2 }}
        >
          Write New +
        </Button>
      </Paper>
    );
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        My Journal
      </Typography>
<br></br>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {renderCalendar()}
        </Grid>
        <Grid item xs={12} md={8}>
          {isAddingEntry && (
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
          )}

          <Typography variant="h6" sx={{ mb: 2 }}>
            Entries for {selectedDate.toLocaleDateString()}
          </Typography>

          <List>
            <AnimatePresence>
              {filteredEntries.map((entry) => (
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default Journal;