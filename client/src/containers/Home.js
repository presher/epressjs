import React, { useState } from "react";
import axios from 'axios'
import config from '../config/config.test.json'
import { useHistory } from "react-router-dom";
import "./Home.css";

const apiURL = config.EXPRESS_APP_URL;

export default function Home() {
    const history = useHistory();

    const storedJwt = localStorage.getItem('token');
    const [jwt, setJwt] = useState(storedJwt || null);
    const [images, setImages] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    function delay(delayTime){
        return new Promise((res) => {
            setTimeout( res, delayTime );
        })
    }

    const getImages = async () => {
        console.log(jwt)
          try {
            const { data } = await axios.get(`${apiURL}/images`, {
              headers: {
                'authorization': `Bearer ${jwt}`
              }
            });
            console.log(data);
            setImages(data);
            setFetchError(null);
          } catch (err) {
              console.log(err.message);
            setFetchError("You session has expired please logout");
            await delay(10000);
            history.push('/login');
          }
        };

  return (
    <>

    <div className="Home">
      <div className="lander">
        <h1>Images</h1>
        <p>View, add, update or delete images</p>
      </div>
    </div>
    <section>
      <button onClick={() => getImages()}>
        Get Images
      </button>
      <table>
      <thead>
          <tr>
              <th>Image</th>
          </tr>
      </thead>
      <tbody>
      {images.map((image, i) => (
          <tr key={image.photoID}>
          
              <td >
                  <img src={config.EXPRESS_DB_URL + image.imageLocation} alt="" height="100" />
                  <button>delete</button>
              </td>
              
             </tr>
             ))}
             </tbody>
             
      </table>
      {/* <ul>
        {images.map((image, i) => (
          <li key={image.photoID}><img src={config.EXPRESS_DB_URL + image.imageLocation} alt="" height="100" /></li>
        ))}
      </ul> */}
      {fetchError && (
        <p style={{ color: 'red' }}>{fetchError}</p>
      )}
    </section>

    
    </>
  );
}