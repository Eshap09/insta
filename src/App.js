import { Button, Input, Modal } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";

import "./App.css";
import { auth, db } from "./firebase";
import ImageUpload from "./ImageUpload";
import Post from "./Post";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [username, setusername] = useState('');
  const [user,setuser]=useState(null);
  const [opensignin, setopensignin] = useState(false);

  useEffect(() => {
      const unsubscribe=auth.onAuthStateChanged((authUser)=>{
          if(authUser)
          { console.log(authUser);
            setuser(authUser);
            
          }
          else
          {
            setuser(null);
          }
      })
      return ()=>{
          unsubscribe();
      }

  }, [user,username]);

  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setposts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signup=(event)=>{
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        setopen(false);  
        return authUser.user.updateProfile({
              displayName:username
          })
          
      })
      .catch((error)=> alert(error.message))
    }

    const signin=(event)=>{
        event.preventDefault();
        auth
            .signInWithEmailAndPassword(email,password)
            .catch((error)=>alert(error.message))

            setopensignin(false);   

    }

  return (
    <div className="App">

      <Modal 
         open={open} 
         onClose={() => setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
            <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setusername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setemail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
            />
            <Button type='submit' onClick={signup}>Sign up</Button>
            </form>
        </div>
      </Modal>

      <Modal 
         open={opensignin} 
         onClose={() => setopensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
            <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setemail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
            />
            <Button type='submit' onClick={signin}>Sign in</Button>
            </form>
        </div>
      </Modal>


      <div className="app__header">
        
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram" />
        {!user? 
            <div className="app__logincontainer">
          <Button onClick={() => setopensignin(true)}>Sign In</Button>
          <Button onClick={() => setopen(true)}>Sign Up</Button>
           </div>
          :
        <Button onClick={() => auth.signOut()}>Logout</Button>
      }
      </div>
      
      <div className="app__posts">
        {/*posts*/}
        <div className="app__postleft">
         {posts.map(({ id, post }) => (
            <Post
                key={id}
                postid={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imgUrl}
                user={user}
        />
        
      ))}
      </div>
      </div>
         
      
        {user?.displayName?
        (<ImageUpload username={user.displayName}/>)
        :
        (<h3>Login to upload</h3>)
        }
    </div>
  );
};
export default App;
