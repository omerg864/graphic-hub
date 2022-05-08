import {getViewToken, reset, updateViewToken} from '../features/viewTokens/viewTokenSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Spinner from '../components/Spinner';


function EditToken() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const {token, isLoading, isSuccess, isError, message} = useSelector((state) => state.viewToken);

    const [tokenData, setTokenData] = useState({name: '', expires: 0});

    const getYear = (date) => {
        if (date === ""){
            return 9999;
        }
        const d = new Date(date);
        return d.getFullYear();
    }

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString();
      }

      const updateToken = () => {
        dispatch(updateViewToken({
            id: params.id,
            name: tokenData.name,
            expires: tokenData.expires
        })).then(() => {
            navigate('/settings');
        });
      }

    useEffect(() => {
        dispatch(getViewToken(params.id)).then((result) => {
            setTokenData({name: result.payload.token.name, expires: 0});
        });
    }, []);

    useEffect(() => {
        if (isSuccess) {
            dispatch(reset());
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message]);

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <>
    <div className="center-div">
        <div className="content-section">
            <div className="center-div">
            <h1>Edit Section</h1>
            </div>
            <form>
            <div className="form-group" style={{marginBottom: '10px'}}>
                <label style={{fontWeight: '600'}}>Token Name</label>
                <input type="text" className="form-control" name="name" id="name" value={tokenData.name} onChange={(e) => setTokenData({...tokenData, name: e.target.value})} placeholder="Token Name" />
                </div>
                <div className="form-group" style={{marginBottom: '10px'}}>
                <a style={{fontWeight: '600'}}>Token Expires: {getYear(token.expires) === 9999 ? 'Never' : formatDate(token.expires)}</a>
                {getYear(token.expires) !== 9999 && <div>
                    <label style={{fontWeight: '600'}}>Add Days to expire date:</label>
                     <input type="number" max="9999999" className="form-control" name="expires" id="expires" value={tokenData.expires} onChange={(e) => setTokenData({...tokenData, expires: e.target.value})} placeholder="Add Days" />
                     </div>}
            </div>
            <button className="btn btn-primary" onClick={updateToken}>Update Token</button>
            </form>
    </div>
    </div>
    </>
  )
}

export default EditToken