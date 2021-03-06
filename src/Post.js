import React, { useEffect, useState } from 'react'
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import { Button, Input } from '@material-ui/core';
import firebase from 'firebase';
function Post({username, user,caption, imageUrl,postid}) {

    const[Comments,setComments]=useState([]);
    const [comment,setcomment]=useState('');
    useEffect(() => {
        let unsubscribe;
        if(postid){
            unsubscribe = db
            .collection("posts")
            .doc(postid)
            .collection("comments")
            .orderBy("timestamp","asc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })  
        }
        return () => {
            unsubscribe();
        }
    }, [postid]);

    console.log({Comments});
    const postcomment=(e)=>{
        e.preventDefault();
        db.collection("posts").doc(postid).collection("comments").add({
            text:comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()

        });
        setcomment('');
    }

    return (
        <div className="post">
            
            {/*header -> avatar + username*/}
            <div className="post__header">
            <Avatar 
            className="post__avatar"
            alt={username} 
            src="/static/images/avatar/1.jpg" />
            <h3>{username}</h3>
            </div>   

            {/*image*/}
            <img className="post__image" src={imageUrl} alt="" />
            
            {/*username +caption*/}
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>
            
            
              <div className="post__comments">
                  {
                      
                    Comments.map((comment)=>(
                    <div className="post__everycomments">  
                    <p>
                         <strong className="post__textstrong">{comment.username}</strong> {comment.text}
                     </p>
                     </div>          
                    ))}   
              </div>        
           {user && <form className="post__commentbox">
                <Input
                   className="post__input"
                   type="text"
                   placeholder="Add a comment"
                   value={comment}
                   onChange={(e)=>setcomment(e.target.value)}
                />
                <Button  
                  className="post__button"
                  disabled={!comment}
                  type="submit"
                  onClick={postcomment}
                  >
                    Post
                  </Button>
            </form>
           }
        </div>
    )
}

export default Post
