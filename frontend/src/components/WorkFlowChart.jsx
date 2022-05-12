import { useSelector, useDispatch } from 'react-redux';
import HeatMap from '@uiw/react-heat-map';


function WorkFlowChart({workFlow}) {

  console.log(workFlow[0].date);

  const value = [
    ...workFlow,
    { date: '2016/01/11', count:2 },
    { date: '2016/04/12', count:2 },
    { date: '2016/05/01', count:5 },
    { date: '2016/05/02', count:5 },
    { date: '2016/05/03', count:1 },
    { date: '2016/05/04', count:11 },
    { date: '2016/05/08', count:32 },
  ];

  console.log(value);
  

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
        <HeatMap value={value} startDate={new Date('2022/01/01')}/>
    </div>
</div>
  )
}

export default WorkFlowChart