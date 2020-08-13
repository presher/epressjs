import React, { useState, useEffect } from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import axios from 'axios'
import config from '../config/config.test.json'



const apiURL = config.EXPRESS_APP_URL;
export default function Edit(){
  let params = useParams();
    const storedJwt = localStorage.getItem('token');
    const [setFetchImageError] = useState(null);
    const [jwt] = useState(storedJwt || null);
    // const [image, setImage] = useState({})
    const [imageName, setImageName] = useState("");
    const [fileType, setFileType] = useState("");
    const [sittingType, setSittingType] = useState("");
    const [imageComments, setImageComments] = useState("")
    const [id] = useState(params.id)
    const history = useHistory();

    useEffect(() => {
        onLoad();
      }, []);

      async function onLoad(){
       await getImageById(id)
      }

    

    const getImageById = async (id) =>
    {
        try{
          const { data } = await axios.get(`${apiURL}/image/${id}`, {
            headers: {
              'authorization': `Bearer ${jwt}`,
              "Access-Control-Allow-Origin":"*"
            }
          });
          setImageName(data[0].imageName);
          setFileType(data[0].fileType);
          setSittingType(data[0].sittingType);
          setImageComments(data[0].imageComments)
          setFetchImageError(null)
        }
          catch(err){
              setFetchImageError(err.message);
          }
    }

    const updateImageInfo = async () => {
        console.log('in update image')
        try{
          const { data } =  await axios({
            method: 'post',
            url:  `${apiURL}/image/update`,
            data:{
              id,
              imageName,
              fileType,
              sittingType,
              imageComments
            },
            headers: {
              'authorization': `Bearer ${jwt}`,
              "Access-Control-Allow-Origin":"*"
            }
          })
          console.log(data)
          setFetchImageError(null);
          if(data.status === 200){
              alert('Image updated successfully');
              history.push("/");
          }
        }
        catch(err){
          setFetchImageError(err.message);
        }
      }
    
      async function handleSubmit(event) {
        event.preventDefault();
        try{
        await updateImageInfo();
        history.push("/");
        }
        catch(e){
          alert(e.message)
        }
      }
      
        return(
            <div className="Login">
            <form onSubmit={handleSubmit}>
              <FormGroup controlId="photoID" bsSize="large">
              <h3>Image ID: {id}</h3>
              {/* {image.map((img, i) => (
                setImageName = img.imageName,
                setFileType = img.fileType,
                setImageComments = img.imageComments,
                setSittingType = img.sittingType
              ))} */}
              
              </FormGroup>
              
                <FormGroup controlId="imageName" bsSize="large">
                <ControlLabel>Image Name: {imageName}</ControlLabel>
                <FormControl
                  defaultValue={imageName}
                  onChange={e => setImageName(e.target.value)}
                  type="text"
                  
                />
              </FormGroup>
              
              <FormGroup controlId="sittingType" bsSize="large">
                <ControlLabel>Sitting Type: {sittingType}</ControlLabel>
                <FormControl
                  defaultValue={sittingType}
                  onChange={e => setSittingType(e.target.value)}
                  type="text"
                />
              </FormGroup>

              <FormGroup controlId="fileType" bsSize="large">
                <ControlLabel>File Type: {fileType}</ControlLabel>
                <FormControl
                  defaultValue={fileType}
                  onChange={e => setFileType(e.target.value)}
                  type="text"
                />
              </FormGroup>

              <FormGroup controlId="imageComments" bsSize="large">
                <ControlLabel>Image Comments: </ControlLabel>
                <FormControl
                  defaultValue={imageComments}
                  onChange={e => setImageComments(e.target.value)}
                  type="textarea"
                />
              </FormGroup>
              
              <Button block bsSize="large"  type="submit">
                Submit Edits
              </Button>
            </form>
          </div>
        );
        
    }
    