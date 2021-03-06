import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateFollow } from '../features/auth/authSlice';
import { FaUserFriends } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

function ProfileData({ friend, user, isChat }) {

    const [isUser, setIsUser] = useState(false);

    const [isFollowed, setIsFollowed] = useState(false);

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

  
    const goTOChat = () => {
      navigate(`/chat/${params.username}`);
    }

    const goToSettings = () => {
      navigate(`/settings/`);
    }
  
    const follow = () => {
      dispatch(updateFollow(params.username));
      setIsFollowed(!isFollowed);
    }

    useEffect(() => {
      if (user) {
        if (user.username === params.username){
          setIsUser(true);
        }
        if (user.following.includes(params.username)){
          setIsFollowed(true);
        }
      }
      }, []);

    useEffect(() => {
      if (user) {
        if (user.username === params.username){
          setIsUser(true);
        }
        if (user.following.includes(params.username)){
          setIsFollowed(true);
        }
      }
      }, [setIsFollowed, setIsUser]);

  return (
    <>
        <div style={{marginRight: '10px'}}>
      <img src={friend.img_url ? friend.img_url : "https://res.cloudinary.com/omerg/image/upload/v1650568412/149071_gb8qdr.png"} alt="profile" className="rounded-circle account-img"/>
      <h2>{friend.f_name} {friend.l_name}</h2>
      <h5><Link to={`/${friend.username}`}>{friend.username}</Link></h5>
      <p>{friend.intro}</p>
      <small><FaUserFriends/> {friend.followers.length} followers • {friend.following.length} following</small>
      <div>
      <small><MdEmail /> {friend.email}</small>
      {friend.company && <div><small><HiOutlineOfficeBuilding /> Company: {friend.company}</small></div>}
      </div>
      <div>
        {user && isUser && <button className="btn btn-primary btn-block" onClick={goToSettings}>Edit Profile</button>}
        {user && !isUser && <div>
         {!isChat && (isFollowed ? <button className="btn btn-primary btn-block" onClick={follow}>Unfollow</button> : <button className="btn btn-primary btn-block" onClick={follow}>Follow</button>)} 
        {!isChat && <button className="btn btn-success btn-block" onClick={goTOChat}>Chat</button>}
         </div>}
      </div>
      </div>
    </>
  )
}

export default ProfileData