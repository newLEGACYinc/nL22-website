import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import SearchBox from "./SearchBox";
import axios from "axios";
import axiosRetry from "axios-retry";
import { DiscordLoginButton } from "react-social-login-buttons";

function VotingApp() {
  const [nameList, setNameList] = useState([]);
  const [ballot, setBallot] = useState({});
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setisLoaded] = useState(false);
  const oauthURL =
    "https://discord.com/api/oauth2/authorize?client_id=1153602966708813844&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2FnL22&response_type=token&scope=identify%20guilds%20guilds.members.read";

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
    if (accessToken == "null") {
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
    <div className="dark" style={{ height: "100%" }}>
      <div
        className="bg-slate-200 dark:bg-slate-700"
        style={{ height: "100%" }}
      >
        <Helmet>
          <title>nL 22</title>
        </Helmet>
        <img
          src="../images/nl22logo.png"
          style={{
            width: "150px",
          }}
        ></img>
        {isLoggedIn ? (
          isLoaded ? (
            <>
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`}
                id="avatar"
                className="rounded-full w-12 h-12 mr-3"
              />
              <span id="name">{user.username}</span>
              <span onClick={logOut}>(Logout)</span>
              <div className="grid grid-cols-2 gap-2 border-black w-screen">
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
              </div>
              <button
                type="button"
                className="text-white bg-blue-600 hover:text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2 text-center"
                onClick={validateBallot}
              >
                <span>Submit</span>
              </button>
            </>
          ) : (
            <p>Connecting to Discord API...</p>
          )
        ) : (
          <div className="flex items-center justify-center h-screen bg-discord-gray text-white">
            <DiscordLoginButton
              onClick={() => (window.location.href = oauthURL)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default VotingApp;
