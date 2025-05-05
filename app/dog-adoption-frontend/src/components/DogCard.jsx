import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
} from '@mui/material';

function DogCard({ dog, favorites, setFavorites }) {

  const isFavorite = favorites.has(dog.id);

  const handleFavoriteToggle = () => {
    setFavorites(prev => {
      const updated = new Set(prev);
      isFavorite ? updated.delete(dog.id) : updated.add(dog.id);
      return updated;
    });
  };
  

  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 4,
        boxShadow: 3,
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' }
      }}
      key={dog.id}
    >
      <CardMedia
        component="img"
        height="200"
        image={dog.img || '/default-dog.jpg'}
        alt={dog.name}
      />
      <CardContent sx={{ backgroundColor: '#fafafa' }}>
        <Typography variant="h6" gutterBottom>{dog.name}</Typography>
        <Typography variant="body2" color="text.secondary">Breed: {dog.breed}</Typography>
        <Typography variant="body2" color="text.secondary">Age: {dog.age}</Typography>
        <Typography variant="body2" color="text.secondary">Zip Code: {dog.zip_code}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" sx={{ color: 'white', backgroundColor: '#4e342e', '&:hover': {
                backgroundColor: '#3e2723',}}} variant="outlined" onClick={handleFavoriteToggle}>
                  {isFavorite ? 'Unfavorite' : 'Favorite'}
                </Button>
      </CardActions>
    </Card>
  );
}

export default DogCard;
