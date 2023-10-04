import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import SearchBox from "./SearchBox";
import axios from "axios";
import axiosRetry from "axios-retry";
import { DiscordLoginButton } from "react-social-login-buttons";

function VotingApp() {
  const [nameList] = useState([]);
  const [ballot, setBallot] = useState({});
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setisLoaded] = useState(false);
  const oauthURL =
    "https://discord.com/api/oauth2/authorize?client_id=1153602966708813844&redirect_uri=http%3A%2F%2Flocalhost%2FnL22&response_type=code&scope=guilds%20guilds.members.read%20identify";

  axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount, error) => {
      console.log(`retry attempt: ${retryCount}`);
      return error.response.data["retry_after"] * 1000;
    },
    retryCondition: (error) => {
      return error.response.status === 429;
    },
  });

  useEffect(() => {
    var accessToken = localStorage.getItem("discordToken");
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    window.history.replaceState("", document.title, window.location.pathname);
    if (accessToken === "null") {
      localStorage.removeItem("discordToken");
      accessToken = localStorage.getItem("discordToken");
    }

    if (!accessToken) {
      if (fragment) {
        var newToken = fragment.get("access_token");
        localStorage.setItem("discordToken", newToken);
        if (!newToken) {
          return console.log("No access token found");
        }
        console.log(newToken);
        setIsLoggedIn(true);
        fetchDiscord(newToken, "Bearer");
      }
    } else {
      console.log(`Old Token: ${accessToken}`);
      setIsLoggedIn(true);
      fetchDiscord(accessToken, "Bearer");
    }
  }, []);

  useEffect(() => {
    if (user && nameList) {
      setisLoaded(true);
    }
  }, [user, nameList]);

  function getData() {
    axios.get("/api/nL22/data/2023").then((res) => {
      res.data.forEach(function (wrestler) {
        wrestler.gimmicks.forEach(function (gimmick) {
          nameList.push({
            id: wrestler._id,
            gimmick: gimmick,
            name: wrestler.name,
          });
        });
      });
    });
  }

  function updateBallot(newBallot) {
    setBallot(newBallot);
  }

  function getBallot(user) {
    axios.get(`/api/nL22/ballot/2023/${user.id}`).then((res) => {
      updateBallot(res.data);
    });
  }

  function fetchDiscord(accessToken, tokenType) {
    const config = {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    };
    axios
      .get(
        "https://discord.com/api/users/@me/guilds/139833084722806784/member",
        config
      )
      .then((res) => {
        setUser(res.data.user);
        getData();
        getBallot(res.data.user);
      })
      .catch(function (error) {
        console.log(error);
        alert("Failed to connect to the Discord API, please try again later");
        return logOut();
      });
  }
  function validateBallot() {
    for (var i = 1; i < 23; i++) {
      if (ballot[i.toString()] === undefined) {
        alert("Invalid Ballot");
        break;
      } else {
        if (i === 22) {
          axios.post("/api/nL22/ballot/2023", ballot);
          alert("Ballot sent, thank you for voting in the 2023 nL 22.");
        }
      }
    }
  }

  function logOut() {
    localStorage.removeItem("discordToken");
    setisLoaded(false);
    setIsLoggedIn(false);
  }

  return (
    <div className="dark h-full">
        <Helmet>
          <title>nL 22</title>
        </Helmet>
        <div className="header drop-shadow-md h-[13%] sm:h-[10%] md:h-[5.4rem]">
          <img
            className="inline-block ml-5 drop-shadow-md mt-4 md:mt-0"
            src="../images/nl22logo.png"
            style={{
              width: "150px",
            }}
          />
          {isLoggedIn && user ? (
            <>
              <div
                className="inline-block float-right md:mr-10 mr-5 mt-4 md:mt-0"
                id="name"
              >
                <span
                  className="ml-1"
                  style={{ textShadow: "1px 1px 2px black" }}
                >
                  {user.username}
                </span>
                <DiscordLoginButton
                  className="w-1 h-0.5 md:w-[200px] md:h-[40px]"
                  onClick={logOut}
                >
                  Logout
                </DiscordLoginButton>
              </div>
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`}
                id="avatar"
                className="rounded-full w-12 h-12 md:w-12 md:h-12 mr-3 inline-block float-right mt-9 md:mt-5"
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <img
          className="mix-blend-overlay fixed object-contain h-full md:h-max md:w-full hidden lg:block"
          src="../images/DSC_9292.png"
        ></img>
        {isLoggedIn ? (
          isLoaded ? (
            <div className="mt-[27%] sm:mt-[25%] md:mt-[5.4rem]">
              <div className="fixed h-full w-1/4 left-1/2 -ml-[12.5%] bg-[#383d52]"></div>
              <div
                className="text-center relative p-5 lg:w-1/4 lg:mx-auto md:p-10 lg:p-15"
                style={{ textShadow: "1px 1px 2px black" }}
              >
                <b>
                  <u>Rules</u>
                </b>
                <ul>
                  <li>The consideration period is January 4th 2023 to 2024</li>
                  <li>
                    Wrestlers must have competed in at least 10 matches (Unaired
                    house shows do not count towards this)
                  </li>
                  <li>Voting ends January 18th</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-2 m-auto justify-center">
                {Array.apply(null, Array(22)).map((key, index) => (
                  <SearchBox
                    key={index}
                    selectedWrestler={ballot[(index + 1).toString()]}
                    nameList={nameList}
                    updateBallot={updateBallot}
                    ballot={ballot}
                    place={(index + 1).toString()}
                  />
                ))}
                <button
                  type="button"
                  className="text-white bg-[#e85b50] hover:text-white hover:bg-[#5d2420] focus:ring-4 focus:ring-blue-300 font-bold rounded-lg w-[383px] text-sm px-5 py-2 text-center relative mx-auto my-5"
                  onClick={validateBallot}
                >
                  <span>Submit</span>
                </button>
              </div>
            </div>
          ) : (
            <p
              className="absolute z-[999] mt-[27%] sm:mt-[25%] md:mt-[5.4rem] font-bold"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              Connecting to Discord API...
            </p>
          )
        ) : (
          <div className="flex items-center justify-center h-screen bg-discord-gray text-white">
            <DiscordLoginButton
              style={{ position: "absolute", width: "75vw" }}
              onClick={() => (window.location.href = oauthURL)}
            />
          </div>
        )}
    </div>
  );
}

export default VotingApp;
