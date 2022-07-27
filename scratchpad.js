import pg from 'pg'; 

const pool = new pg.Pool({
    database: 'petshop',
  })
  pool.query('SELECT NOW()').then((res) => {
    console.log(res, rows); 
    pool.end()
  })
