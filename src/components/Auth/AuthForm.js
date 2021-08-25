import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext)

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = e => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPasword = passwordInputRef.current.value;

    //optional: Add Validations (REGEX) [password > 8 characters, contains @#$!%^, at least one number]

        
    setIsLoading(true)
    let url;
    if (isLogin) {
      //sign in
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXnD_ob8wbuFKBWW1PDHwceGSljY5n-Uw"
    } else {
      //sign up
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXnD_ob8wbuFKBWW1PDHwceGSljY5n-Uw"
    }

    fetch(url, 
    {
        method: 'POST',
        body: JSON.stringify({
            email: enteredEmail,
            password: enteredPasword,
            returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    }).then((res) => {
      setIsLoading(false)
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authentication Failed';
          // if (data && data.error && data.error.message) {
          //   errorMessage = data.error.message;
          // }
          // alert(errorMessage)
          throw new Error(errorMessage);
        });
      }
    }).then(data => {
      authCtx.login(data.idToken)
      history.replace('/')
      console.log(data)
    })
    .catch(err => {
      alert(err.message)
      setIsLoading(false)
    })
    
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
