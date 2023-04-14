import { useState, useEffect } from "react";
import axios from "axios";

import "./cards.css";

export function DogsIndex(props) {
  const [dogs, setDogs] = useState([]);

  const getDogs = () => {
    axios
      .post("https://frontend-take-home-service.fetch.com/dogs", props.dogIDs, {
        withCredentials: true,
      })
      .then((dogResponse) => {
        setDogs(dogResponse.data);
        // console.log(dogResponse.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(getDogs, [props]);

  return (
    <section key="section" className="articles">
      {dogs?.map((dog) => (
        <article key={dog.id}>
          <div className="article-wrapper">
            <figure>
              <img src={dog.img} alt="Dog photo" />
            </figure>
            <div className="article-body">
              <h2>Name: {dog.name}</h2>
              <p>
                Breed: {dog.breed}
                <br />
                Age: {dog.age}
                <br />
                Zip Code: {dog.zip_code}
              </p>
              {props.handleAdd ? (
                <a
                  onClick={() => {
                    props.handleAdd(dog.id);
                  }}
                  className="read-more"
                >
                  Add to Your Dogs <span className="sr-only">Add to List</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ) : (
                <a
                  onClick={() => {
                    props.handleRemove(dog.id);
                  }}
                  className="read-more"
                >
                  Remove from Your Dogs <span className="sr-only">Remove from List</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </article>

        // </div>
      ))}
    </section>
  );
}
