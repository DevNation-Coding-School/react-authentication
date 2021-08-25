import {useRef, useContext} from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import { useHistory } from 'react-router';

const ProfileForm = () => {

  const history = useHistory();

  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = e => {
    e.preventDefault();

    const enteredNewPasswrod = newPasswordInputRef.current.value;

    //add validation
    fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAXnD_ob8wbuFKBWW1PDHwceGSljY5n-Uw?",
    {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPasswrod,
        returnSecureToken: false,
      }),
      headers: { 'Content-Type': 'application/json'}
    }).then(res => {


      // back button -> onClick => useHistory -> (/previousPageRoute)

      history.replace('/')
      console.log(res)
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
