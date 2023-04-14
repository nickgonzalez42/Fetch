import { useEffect, useState } from "react";
import axios from "axios";

export function DogMatch(props) {
  const [dog, setDog] = useState({});

  const getDogMatch = () => {
    console.log(props.dog);
    axios
      .post("https://frontend-take-home-service.fetch.com/dogs", [props.dog], {
        withCredentials: true,
      })
      .then((response) => {
        setDog(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(getDogMatch, [props]);

  if (props.dog) {
    return (
      <div className="match-card">
        <h2>You matched with:</h2>
        <figure>
          <img style={{ height: "100%" }} src={dog.img} alt="Dog photo" />
        </figure>
        <div>
          <h2>Name: {dog.name}</h2>
          <p>
            Breed: {dog.breed}
            <br />
            Age: {dog.age}
            <br />
            Zip Code: {dog.zip_code} <br />
            Please contact pup@matcher.com to proceed with the adoption process.
          </p>
        </div>
      </div>
    );
  }
  return <></>;
}
