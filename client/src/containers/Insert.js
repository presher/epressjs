import React, { useState} from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { useHistory} from "react-router-dom";
import axios from 'axios'
import config from '../config/config.test.json'
import { AppContext } from '../libs/contextLib.js';
const apiURL = config.EXPRESS_APP_URL;

export default function Insert(){
    const storedJwt = localStorage.getItem('token');
    const [setFetchImageError] = useState(null);
    const [jwt] = useState(storedJwt || null);
    const [imageName, setImageName] = useState("");
    const [fileType, setFileType] = useState("");
    const [sittingType, setSittingType] = useState("");
    const [imageComments, setImageComments] = useState("");
    const [imagePath, setImagePath] = useState("");
    const history = useHistory();
    let inputRef = React.createRef();
    
    async function handleSubmit(){
      console.log(imagePath)
      // let formData = new formData();
      // 
      // 

      axios.post('/media', {
        
      })
      let imageFile = this.inputRef
        try{
         
        const { data } =  await axios.post(`${apiURL}/image/add`, {
          data:{
            imageName,
            fileType,
            sittingType,
            imageComments,
            imagePath: imageFile
          },
          headers: {
            'authorization': `Bearer ${jwt}`,
            "Access-Control-Allow-Origin":"*",
            "Content-Type": "multipart/form-data"
          }
        });
        console.log(data)
        setFetchImageError(null);
        history.push('/');
      }
      
          catch(err){
            console.log(err, 'error')
            alert('Failed to insert image to db')
            setFetchImageError(err.message);
          }
    }

    return(
        
        <div className="Login">
            <h1>Insert Image</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
             
                <FormGroup controlId="imageName" bsSize="large">
                <ControlLabel>Image Name:</ControlLabel>
                <FormControl
                  value={imageName}
                  onChange={e => setImageName(e.target.value)}
                  type="text"
                />
              </FormGroup>
              
              <FormGroup controlId="sittingType" bsSize="large">
                <ControlLabel>Sitting Type: </ControlLabel>
                <FormControl
                  value={sittingType}
                  onChange={e => setSittingType(e.target.value)}
                  type="text"
                />
              </FormGroup>

              <FormGroup controlId="fileType" bsSize="large">
                <ControlLabel>File Type: </ControlLabel>
                <FormControl
                  value={fileType}
                  onChange={e => setFileType(e.target.value)}
                  type="text"
                />
              </FormGroup>

              <FormGroup controlId="imageComments" bsSize="large">
                <ControlLabel>Image Comments: </ControlLabel>
                <FormControl
                  value={imageComments}
                  onChange={e => setImageComments(e.target.value)}
                  type="textarea"
                />
              </FormGroup>

              <FormGroup controlId="imagePath" bsSize="large">
                <ControlLabel>Image Path: </ControlLabel>
                <FormControl
                  value={imagePath}
                  onChange={e => setImagePath(e.target.value)}
                  type="file"
                  name="image"
                  multiple
                  ref={inputRef}
                />
              </FormGroup>
              <AppContext.Consumer>
                  {context => (
                      <>
                        {context.isAuthenticated ? <Button block bsSize="large"  type="submit">
                        Insert Image
                    </Button> : "Please Login to Insert Image"}
                    
                    </>
                  )}
                
              </AppContext.Consumer>
              
            </form>
          </div>
    )
}