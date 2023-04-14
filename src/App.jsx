import React, { useState, useEffect } from "react";
import axios from "axios";

import Pagination from "./Pagination";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { DogsIndex } from "./DogsIndex";
import { Modal } from "./Modal";
import { DogMatch } from "./DogMatch";
import { Breeds } from "./Breeds";

import "./style.scss";

let PageSize = 25;

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [dogIDs, setDogIDs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDogs, setTotalDogs] = useState(0);
  const [selectedDogIDs, setSelectedDogIDs] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [matchedDog, setMatchedDog] = useState("");
  const [sort, setSort] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [allBreeds, setAllBreeds] = useState([]);

  const key = `${process.env.REACT_APP_API_KEY}`;
  axios.defaults.headers.common["fetch-api-key"] = key;

  const handleLogin = (params) => {
    axios
      .post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          name: params.get("name"),
          email: params.get("email"),
        },
        { withCredentials: true, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" } }
      )
      .then((response) => {
        localStorage.setItem("name", params.get("name"));
        localStorage.setItem("email", params.get("email"));
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const addSelectedDog = (dogID) => {
    if (selectedDogIDs.includes(dogID)) {
      return;
    }
    let currentDogs = [...selectedDogIDs, dogID];
    setSelectedDogIDs(currentDogs);
  };

  const deleteSelectedDog = (dogID) => {
    let currentDogs = [...selectedDogIDs];
    let i = currentDogs.indexOf(dogID);
    currentDogs.splice(i, 1);
    setSelectedDogIDs(currentDogs);
  };

  const handleLogout = () => {
    axios
      .post(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
        },
        { withCredentials: true, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" } }
      )
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleShowCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleShowFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleFilter = (params) => {
    let arr = [];
    for (const value of params.values()) {
      arr.push(value);
    }
    setSelectedBreeds(arr);
  };

  const handleMatch = () => {
    if (selectedDogIDs.length > 0) {
      axios
        .post("https://frontend-take-home-service.fetch.com/dogs/match", selectedDogIDs, { withCredentials: true })
        .then((response) => {
          setSelectedDogIDs([]);
          setMatchedDog(response.data.match);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please add more dogs to Your Dogs.");
    }
  };

  const handleClose = () => {
    setMatchedDog("");
  };

  useEffect(() => {
    setTimeout(() => {
      let dogNumber = (currentPage - 1) * 25;
      let order = "";
      if (sort) {
        order = "asc";
      } else {
        order = "desc";
      }
      let breed = "";
      if (selectedBreeds.length > 0) {
        for (let i = 0; i < selectedBreeds.length; i++) {
          breed += `&breeds=${selectedBreeds[i]}`;
        }
      }
      console.log(selectedBreeds + "BREEDS");
      axios
        .get(`https://frontend-take-home-service.fetch.com/dogs/search?from=${dogNumber}&sort=breed:${order}${breed}`, {
          withCredentials: true,
        })
        .then((response) => {
          setDogIDs(response.data.resultIds);
          setTotalDogs(response.data.total);
          axios
            .get("https://frontend-take-home-service.fetch.com/dogs/breeds", { withCredentials: true })
            .then((response) => {
              console.log(response);
              setAllBreeds(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          setLoading(false);
        })
        .catch((error) => {
          setDogIDs([]);
          setLoading(false);
        });
    }, 1500);
  }, [currentPage, sort, selectedBreeds]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        Loading the data {console.log("loading state")}
      </div>
    );
  }

  const linkStyle = {
    cursor: "pointer",
  };

  return (
    <>
      {dogIDs.length === 0 ? (
        <>
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
          <div className="navbar">
            <Logout handleLogout={handleLogout} />
            <a style={linkStyle} onClick={handleShowCart}>
              {isCartVisible ? "Back to List" : "Your Dogs"}
            </a>
            <div className="navbar-right">
              <a style={linkStyle} onClick={handleMatch}>
                Match!
              </a>
              <a style={linkStyle} onClick={handleShowFilter}>
                Filter
              </a>
              <a
                style={linkStyle}
                onClick={() => {
                  setSort(!sort);
                }}
              >
                {sort ? "Ascending" : "Descending"}
              </a>
            </div>
          </div>
          <Modal onClose={handleClose} show={matchedDog}>
            <DogMatch dog={matchedDog} />
          </Modal>
          {!isCartVisible ? (
            <div className="main">
              {isFilterVisible ? <Breeds onFilter={handleFilter} breeds={allBreeds} /> : <></>}
              <DogsIndex handleAdd={addSelectedDog} dogIDs={dogIDs} />
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={totalDogs}
                pageSize={PageSize}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          ) : (
            <>
              <DogsIndex handleRemove={deleteSelectedDog} dogIDs={selectedDogIDs} />
            </>
          )}
        </>
      )}
    </>
  );
}
