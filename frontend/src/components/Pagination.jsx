

function Pagination({ pages, queryPage }) {

    const getQuery = () => {
        let search = window.location.search;
        let query = search.replace('?', '').split('&');
        let query_obj = {};
        query.forEach((item) => {
            if (item){
            let split = item.split('=');
          let key = split[0];
          let value = split[1];
          if (key.includes('page')) {
            query_obj[key] = parseInt(value) - 1;
          } else{
              query_obj[key] = value;
          }
        }
        });
        if (!query_obj[queryPage]) {
          query_obj[queryPage] = 0;
        }
        return query_obj;
      }

    const addtoQueryString = (number) => {
        let query = getQuery();
        query[queryPage] = query[queryPage] + number;
        let query_string = "?" + Object.keys(query).map((key) => {
            return key + '=' + query[key];
        }).join('&');
        return query_string;
    }

    const getQueryString = (number) => {
        let query = getQuery();
        query[queryPage] = number;
        let query_string = "?" + Object.keys(query).map((key) => {
            return key + '=' + query[key];
        }).join('&');
        return query_string;
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
  {getQuery()[queryPage] > 0 && <li class="page-item"><a class="page-link" href={addtoQueryString(0)}>Previous</a></li>}
    {getArray(pages).map(page => (
      <li class={"page-item" + (page - 1 == getQuery()[queryPage] ? ' active' : '')}><a class="page-link" href={getQueryString(page)}>{page}</a></li>
    ))}
    {getQuery()[queryPage] + 1 != pages && <li class="page-item"><a class="page-link" href={addtoQueryString(2)}>Next</a></li>}
  </ul>
</nav>
</div>
  )
}

export default Pagination