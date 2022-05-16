import PasswordForm from "../components/PasswordForm"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { reset } from "../features/auth/authSlice";



function ResetPassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isSuccess) {
            toast.success("Password changed successfully");
            dispatch(reset());
            navigate("/login");
        }
    }, [isSuccess, isError, message, navigate, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <>
    <div className="center-div">
        <div className="content-section">
    <h1>Password Reset</h1>
    <PasswordForm type="Reset" />
    </div>
    </div>
    </>
  )
}

export default ResetPassword