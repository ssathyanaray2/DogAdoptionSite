import { Container, Box, TextField, Button, Grid, MenuItem, Select, Typography, InputLabel, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
import DogCard from '../components/DogCard';
import Pagination from '../components/Pagination';
import Paw from '@mui/icons-material/Pets';

function SearchPage() {
  const [breeds, setBreeds] = useState([]);
  const [searchParams, setSearchParams] = useState({
    breed: '',
    zip: '',
    ageMin: '',
    ageMax: '',
    sort: 'breed',
    sortDirection: 'asc',
  });

  const [dogs, setDogs] = useState([]);
  const [page, setPage] = useState(0);
  const size = 50;
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [isSearchMode, setIsSearchMode] = useState(true); 
  useEffect(() => {
    const fetchBreeds = async () => {
      const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setBreeds(data);
      } else {
        console.error("Failed to fetch breeds");
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    if (isSearchMode) {
      searchDogs();
    }
  }, [page, isSearchMode]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const clearFilters = () => {
    setSearchParams({
      breed: '',
      zip: '',
      ageMin: '',
      ageMax: '',
      sort: 'breed',
      sortDirection: 'asc',
    });
    setPage(0);
    setDogs([]);
  };

  const showFavorites = async () => {
    setIsSearchMode(false); 
    if (favorites?.size > 0) {
      const detailsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(Array.from(favorites)),
      });

      if (!detailsRes.ok) throw new Error('Details fetch failed');
      const dogsData = await detailsRes.json();
      setDogs(dogsData);
    } else {
      alert('No favorites to show');
      window.location.reload();
    }
  };

  const matchFavorites = async () => {
    setIsSearchMode(false); 
    if (favorites?.size > 0) {
      const detailsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(Array.from(favorites)),
      });

      if (!detailsRes.ok) throw new Error('Match fetch failed');
      const matchData = await detailsRes.json();

      const matchdetailsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify([matchData.match]),
      });

      if (!matchdetailsRes.ok) throw new Error('Details fetch failed');
      const dogsData = await matchdetailsRes.json();
      setDogs(dogsData);
    } else {
      alert('No favorites to match');
      window.location.reload();
    }
  };

  const searchDogs = async () => {
    setIsSearchMode(true); 
    try {
      const params = {
        breeds: searchParams.breed ? [searchParams.breed] : undefined,
        zipCodes: searchParams.zip ? [searchParams.zip] : undefined,
        ageMin: searchParams.ageMin || undefined,
        ageMax: searchParams.ageMax || undefined,
        sort: searchParams.sort && searchParams.sortDirection ? `${searchParams.sort}:${searchParams.sortDirection}` : undefined,
        size,
        from: page * size,
      };

      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => queryParams.append(key, val));
        } else if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      console.log(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`)
      const searchRes = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      if (!searchRes.ok) throw new Error('Search failed');
      const searchData = await searchRes.json();
      setTotal(searchData.total || 0);

      if (searchData.resultIds?.length > 0) {
        const detailsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(searchData.resultIds),
        });

        if (!detailsRes.ok) throw new Error('Details fetch failed');
        const dogsData = await detailsRes.json();
        setDogs(dogsData);
      }
    } catch (error) {
      console.error('Dog search error:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Breed</InputLabel>
            <Select
              value={searchParams.breed}
              onChange={(e) => setSearchParams(p => ({ ...p, breed: e.target.value }))}
              label="Breed"
            >
              <MenuItem value="">All</MenuItem>
              {breeds.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField label="Zip Code" fullWidth
            value={searchParams.zip}
            onChange={(e) => setSearchParams(p => ({ ...p, zip: e.target.value }))} />
        </Grid>

        <Grid item xs={3}>
          <TextField label="Min Age" type="number" fullWidth
            value={searchParams.ageMin}
            onChange={(e) => setSearchParams(p => ({ ...p, ageMin: e.target.value }))} />
        </Grid>

        <Grid item xs={3}>
          <TextField label="Max Age" type="number" fullWidth
            value={searchParams.ageMax}
            onChange={(e) => setSearchParams(p => ({ ...p, ageMax: e.target.value }))} />
        </Grid>

        <Grid item xs={6} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={searchParams.sort}
              onChange={(e) => setSearchParams(p => ({ ...p, sort: e.target.value }))}
              label="Sort By"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="breed">Breed</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="age">Age</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Direction</InputLabel>
            <Select
              value={searchParams.sortDirection}
              onChange={(e) => setSearchParams(p => ({ ...p, sortDirection: e.target.value }))}
              label="Direction"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" flexDirection="row" gap={2}>
            <Button variant="contained" sx={{ backgroundColor: '#4e342e', '&:hover': { backgroundColor: '#3e2723' } }} onClick={() => { setPage(0); searchDogs(); }}>
              <Paw sx={{ mr: 1 }} />Search
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#4e342e', '&:hover': { backgroundColor: '#3e2723' } }} onClick={() => { clearFilters(); searchDogs(); }}>
              <Paw sx={{ mr: 1 }} />Clear
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#4e342e', '&:hover': { backgroundColor: '#3e2723' } }} onClick={() => { clearFilters(); showFavorites(); }}>
              <Paw sx={{ mr: 1 }} />Show Favorites
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#4e342e', '&:hover': { backgroundColor: '#3e2723' } }} onClick={() => { clearFilters(); matchFavorites(); }}>
              <Paw sx={{ mr: 1 }} />Match
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {dogs.map((dog) => (
          <Grid item xs={12} sm={6} md={4} key={dog.id}>
            <DogCard dog={dog} favorites={favorites} setFavorites={setFavorites}/>
          </Grid>
        ))}
      </Grid>

      {isSearchMode && (
        <Pagination
          total={total}
          page={page}
          onChange={(newPage) => setPage(newPage)}
          size={size}
        />
      )}
    </Container>
  );
}

export default SearchPage;
