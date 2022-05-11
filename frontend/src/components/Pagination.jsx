

function Pagination({ pages }) {

    const getQuery = () => {
        let search = window.location.search;
        let query = search.replace('?', '').split('&');
        let query_obj = {};
        query.forEach((item) => {
            let split = item.split('=');
          let key = split[0];
          let value = split[1];
          if (key === 'page') {
            query_obj[key] = parseInt(value) - 1;
          } else{
              query_obj[key] = value;
          }
        });
        if (!query_obj.page) {
          query_obj.page = 0;
        }
        return query_obj;
      }
    
      const getArray = (pages) => {
        let array = [];
        for (let i = 1; i <= pages; i++) {
          array.push(i);
        }
        return array;
      }


  return (
    <div className="center-div" style={{marginTop: '20px', marginBottom: '10px'}}>
      <nav aria-label="Page navigation example">
  <ul class="pagination">
  {getQuery().page > 0 && <li class="page-item"><a class="page-link" href={`?page=${getQuery().page}`}>Previous</a></li>}
    {getArray(pages).map(page => (
      <li class={"page-item" + (page - 1 == getQuery().page ? ' active' : '')}><a class="page-link" href={`?page=${page}`}>{page}</a></li>
    ))}
    {getQuery().page + 1 != pages && <li class="page-item"><a class="page-link" href={`?page=${getQuery().page + 2}`}>Next</a></li>}
  </ul>
</nav>
</div>
  )
}

export default Pagination