import React, { useState, useEffect } from "react";
import { Button} from "react-bootstrap";
import axios from 'axios'
import config from '../config/config.test.json'
import { useHistory } from "react-router-dom";
import { AppContext } from "../libs/contextLib";
import { LinkContainer } from "react-router-bootstrap";
import { NavItem } from "react-bootstrap";
import "./Home.css";

const apiURL = config.EXPRESS_APP_URL;

export default function Home() {
  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const [images, setImages] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad(){
    if(storedJwt){
      await getImages();
      history.push("/");
    }else{
      history.push('/login');
    }
      
     
  }
    
    function delay(delayTime){
        return new Promise((res) => {
            setTimeout( res, delayTime );
        })
    }
    
    const getImages = async () => {
          try {
            const { data } = await axios.get(`${apiURL}/images`, {
              headers: {
                'authorization': `Bearer ${jwt}`,
                "Access-Control-Allow-Origin":"*"
              }
            });
            setImages(data);
            setFetchError(null);
          } catch (err) {
              console.log(err.message);
            setFetchError("You session has expired please logout");
            await delay(5000);
            history.push('/login');
          }
        };


     async function deleteImage(id) {
       console.log('id', id)
      try{
        let deleted = await axios.post(`${apiURL}/image/delete/`, {
          data:{
            id
          },
          headers: {
            'authorization': `Bearer ${jwt}`,
            "Access-Control-Allow-Origin":"*"
          }
        });
        console.log('deleted', deleted);
        if(deleted.status === 200){
          getImages()
        }
        
      }catch(err){
        console.log('err message', err.message);
      }
    }


  return (
    <>
    <div className="Home">
      <div className="lander">
        <h1>Images</h1>
        <p>View, add, update or delete images</p>
      </div>
    </div>
    <div className="grid-container">
    {images.map((image, i) => (
      <div key={image.photoID}>
        <div className="grid-item">
          <h4>Image Name: {image.imageName}</h4>
              <img src={config.EXPRESS_DB_URL + image.imageLocation} alt="" height="100" />
              <p>Sitting Type: {image.sittingType}</p>
              <p>File Type: {image.fileType}</p>
              <h6>Comments:</h6>
              <textarea rows="4" columns=" 50" defaultValue={image.imageComments}></textarea>
                      <AppContext.Consumer>
                        {context =>(
                          <>
                          {context.isAuthenticated ? 
                            <LinkContainer to={`/edit/${image.photoID}`}>
                              <NavItem >Edit Image {image.photoID}</NavItem>
                            </LinkContainer> : ''}
                            {context.isAuthenticated ? <Button block bsSize="large"  type="submit" onClick={() => deleteImage(image.photoID)}>Delete Image {image.photoID}</Button> : ''}
                          </>
                        )}
                      </AppContext.Consumer>
          </div>
      </div>
    ))
  }
    </div>
   
      {fetchError && (
        <p style={{ color: 'red' }}>{fetchError}</p>
      )}
    
    </>
    
    
  );
}