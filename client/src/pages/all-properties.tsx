import { useMemo } from 'react';
import { Add } from '@mui/icons-material';
import { useTable } from '@pankod/refine-core';  // poerful refine hook for pagination, filtering and sorting
import { Box, Stack, Typography, TextField, Select, MenuItem } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';

import { PropertyCard, CustomButton } from 'components';

const AllProperties = () => {
  const navigate = useNavigate();

  const {
    tableQueryResult: { data, isLoading, isError },

    current, // refine hooks for pagination
    setCurrent,
    setPageSize,
    pageCount,
    sorter, setSorter,
    filters, setFilters,
  } = useTable();          // useTable hooks reads results for AllProperties list in App.tsx based on base root route

  const allProperties = data?.data ?? [];

  // current price property order
  const currentPrice = sorter.find((item) => item.field === 'price')?.order;

  // price toggle button function
  const toggleSort = (field: string) => {
    setSorter([{ field, order: currentPrice === 'asc' ? 'desc' : 'asc'}])
  }

  // property title sort function
  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) => ('field' in item ? item : []));

    return {   // filtering
      title: logicalFilters.find((item) => item.field === 'title')?.value || '',  // search filter for property title or name

      propertyType: logicalFilters.find((item) => item.field === 'propertyType')?.value || '',  // search filter for property type
    }
  }, [filters])

  // check if data is loading or not
  if(isLoading) return <Typography>Loading ...</Typography>
  if(isError) return <Typography>Error ...</Typography>

  return (
    <Box>
      <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {!allProperties.length ? 'There are no properties listed' : 'All Properties'}

            <Box mb={2} mt={3} display="flex" width="84%" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" gap={2} flexWrap="wrap" mb={{ xs: '20px', sm: 0 }}>

                {/* custom button is for sorting */}
                <CustomButton
                  title={`Sort price ${currentPrice === 'asc' ? '↑' : '🠧'}`}
                  handleClick={() => toggleSort('price')}
                  backgroundColor="#475be8"
                  color="#fcfcfc"
                />

                <TextField
                  variant="outlined"
                  color="info"
                  placeholder="Search by title"
                  value={currentFilterValues.title}
                  onChange={(e) => {
                    setFilters([
                      {
                        field: 'title',
                        operator: 'contains',
                        value: e.currentTarget.value ? e.currentTarget.value : undefined
                      }
                    ])
                  }}
                />

                <Select  // filter all dropdown selection button
                  variant="outlined"
                  color="info"
                  displayEmpty
                  required
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={currentFilterValues.propertyType}
                  onChange={(e) => {
                    setFilters([
                      {
                        field: 'propertyType',
                        operator: 'eq',
                        value: e.target.value
                      }
                    ], 'replace')
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {['Apartment', 'Villa', 'Farmhouse', 'Condos', 'Studio', 'Loft', 'Townhouse', 'Duplex', 'Chalet'].map((type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>{type}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <CustomButton
          title="Add Property"
          handleClick={() => navigate('/properties/create')}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Stack>

      <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {allProperties.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            title={property.title}
            price={property.price}
            location={property.location}
            photo={property.photo}
          />
        ))}
      </Box>

      {/* pagination */}
      {allProperties.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">

          {/* previous page */}
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />

          {/* current page */}
          <Box display={{ xs: 'hidden', sm: 'flex' }} alignItems="center" gap="5px">
            Page{' '}<strong>{current} of {pageCount}</strong>
          </Box>

          {/* next page */}
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev) => prev + 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={current === pageCount}
          />
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ 'aria-label': 'Without label' }}
            value=""
            onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}   // set total number of elements for pagination on page
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                Show{size}
              </MenuItem>
            ))}
            <MenuItem value="">All</MenuItem>
          </Select>
        </Box>
      )}
    </Box>
  )
}

export default AllProperties