import { useSelector, useDispatch } from 'react-redux';
import HeatMap from '@uiw/react-heat-map';


function WorkFlowChart({workFlow, now}) {

  var value = [];

  for (var i in workFlow) {
    value.push({ date: workFlow[i].date, count: workFlow[i].count });
  }
  

    const getQuery = () => {
        let search = window.location.search;
        let query = search.replace('?', '').split('&');
        let query_obj = {};
        query.forEach((item) => {
            if (item){
            let split = item.split('=');
          let key = split[0];
          let value = split[1];
          if (key.includes('year')) {
            query_obj[key] = parseInt(value);
          } else{
              query_obj[key] = value;
          }
        }
        });
        if (!query_obj['year']) {
          query_obj['year'] = new Date().getFullYear();
        }
        return query_obj;
      }


  return (
    <div className="card">
    <div className="card-body">
        <h3 className="card-title">Work Flow of past year</h3>
        <HeatMap width={900} rectSize={14} value={value} startDate={now ? new Date(`${new Date().getFullYear() - 1}/${new Date().getMonth() + 1}/${new Date().getDate()}`) : 
        new Date(`${getQuery().year}/01/01`)} endDate={now ? new Date() : new Date(`${getQuery().year}/12/31`)} />
    </div>
</div>
  )
}

export default WorkFlowChart