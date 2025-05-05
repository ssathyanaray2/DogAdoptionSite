import { Pagination, Box } from '@mui/material';

function DogPagination({ total, page, onChange, size }) {
  const pageCount = Math.ceil(total / size);

  return (
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={(_, val) => onChange(val - 1)}
        size="large"
        aria-label="Dog Pagination"
      />
    </Box>
  );
}

export default DogPagination;
