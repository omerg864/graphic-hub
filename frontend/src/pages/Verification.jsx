import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { verifyAccount } from '../features/auth/authSlice';
import {useEffect} from 'react';
import { useParams } from "react-router-dom";

function Verfication() {

  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.auth);
  const params = useParams();


  useEffect(()=>{
    dispatch(verifyAccount(params.id));
}, [])

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <section className="heading">
        <h1>Account is Verified</h1>
        <p className='sub_title'>You can now login to your account</p>
    </section>
  )
}

export default Verfication