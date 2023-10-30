import React, { useState, useEffect, Fragment } from "react";
import SearchBox from "./SearchBox";
import axios from "axios";
import axiosRetry from "axios-retry";
import { DiscordLoginButton } from "react-social-login-buttons";
import { Listbox } from "@headlessui/react";

const years = [
  { id: 2023 },
  { id: 2022 },
  { id: 2021 },
  { id: 2020 },
  { id: 2019 },
];
const from = new Date("2024-01-04");
const to = new Date("2024-01-18");
const current = new Date();

function VotingApp() {
  const [nameList] = useState([]);
  const [ballot, setBallot] = useState({});
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setisLoaded] = useState(false);
  const oauthURL =
    "https://discord.com/api/oauth2/authorize?client_id=1153602966708813844&redirect_uri=https%3A%2F%2F22.newlegacyinc.tv%2F&response_type=token&scope=guilds%20guilds.members.read%20identify";
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [isEnabled, setIsEnabled] = useState(false);

  axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount, error) => {
      console.log(`retry attempt: ${retryCount}`);
      return error.response.data["retry_after"] * 1000;
    },
    retryCondition: (error) => {
      switch (error.response.status) {
        case 429:
          return true;
        default:
          return false;
      }
    },
  });

  useEffect(() => {
    var accessToken = localStorage.getItem("discordToken");
    const fragment = new URLSearchParams(window.location.hash.slice(1));
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
    window.history.replaceState("", document.title, window.location.pathname);
  }, []);

  useEffect(() => {
    if (user && nameList) {
      setisLoaded(true);
    }
  }, [user, nameList]);

  function getData() {
    axios.get(`/api/nL22/data/${selectedYear.id}`).then((res) => {
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

  useEffect(() => {
    if (
      current <= to &&
      current >= from &&
      selectedYear.id >= parseInt(new Date().getFullYear())
    ) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [selectedYear]);

  function updateBallot(newBallot) {
    setBallot(newBallot);
  }

  function getBallot(user) {
    axios.get(`/api/nL22/ballot/${selectedYear.id}/${user.id}`).then((res) => {
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
        console.log(error.response.data["code"]);
        if (error.response.data["code"] === 10004) {
          if (
            window.confirm(
              "You must be a member of the newLEGACYinc Discord Server to vote. Press OK to join."
            )
          ) {
            window.open("https://www.discord.gg/newlegacyinc", "joinDiscord");
          }
        } else {
          alert("Failed to connect to the Discord API, please try again later");
        }
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
          axios.post(`/api/nL22/ballot/${selectedYear.id}`, ballot);
          alert(
            `Ballot sent, thank you for voting in the ${selectedYear.id} nL 22. You can still edit your ballot and resend it if you want to make any changes.`
          );
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
      <div className="header drop-shadow-md h-[13%] sm:h-[10%] md:h-[5.4rem]">
        <img
          className="inline-block ml-5 drop-shadow-md mt-7 md:mt-[-5px] md:p-[10px] w-[100px] md:w-[150px]"
          src="../images/nl22logo.png"
        />
        <div className="absolute ml-28 -mt-10 md:ml-40 md:-mt-16 text-lg font-bold">
          <Listbox value={selectedYear} onChange={setSelectedYear}>
            <Listbox.Button
              className="w-20 text-center"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              {selectedYear.id}
            </Listbox.Button>
            <Listbox.Options>
              {years.map((year) => (
                <Listbox.Option key={year.id} value={year} as={Fragment}>
                  {({ active, selected }) => (
                    <li
                      className={`w-20 text-center ${
                        active
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {selected}
                      {year.id}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        {isLoggedIn && user ? (
          <>
            <div
              className="inline-block float-right md:mr-10 mr-5 mt-7 md:mt-2.5"
              id="name"
            >
              <span
                className="ml-1"
                style={{ textShadow: "1px 1px 2px black" }}
              >
                {user.username}
              </span>
              <DiscordLoginButton
                className="w-1 h-0.5 md:w-[200px] md:h-[45px] text-sm"
                iconSize="15px"
                size="30px"
                style={{ fontSize: "15px" }}
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
      <div className="mt-[27%] sm:mt-[25%] md:mt-[5.4rem]">
        <div className="fixed h-full w-[750px] left-1/2 -ml-[375px] bg-[#383d52]"></div>
        {isEnabled ? (
          isLoggedIn ? (
            isLoaded ? (
              <>
                <div
                  className="text-center relative p-5 lg:w-[750px] lg:mx-auto md:p-10 lg:p-15"
                  style={{ textShadow: "1px 1px 2px black" }}
                >
                  <b>
                    <u>Rules</u>
                  </b>
                  <ul>
                    <li>
                      The consideration period is January 4 {selectedYear.id} to{" "}
                      {selectedYear.id + 1}
                    </li>
                    <li>Wrestlers must have competed in at least 10 matches</li>
                    <li>(These matches must have aired)</li>
                    <li>Voting ends January 18</li>
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
              </>
            ) : (
              <div
                className="text-center relative p-5 lg:w-[750px] lg:mx-auto md:p-10 lg:p-15"
                style={{ textShadow: "1px 1px 2px black" }}
              >
                <p>Connecting to Discord API...</p>
              </div>
            )
          ) : (
            <>
              <div
                className="text-center relative p-5 lg:w-[750px] lg:mx-auto md:p-10 lg:p-15"
                style={{ textShadow: "1px 1px 2px black" }}
              >
                <p>
                  You must be a member of the newLEGACYinc Discord Server to
                  vote.
                </p>
                <p>
                  <a href="https://www.discord.gg/newlegacyinc">
                    https://www.discord.gg/newlegacyinc
                  </a>
                </p>
              </div>
              <div className="flex items-center justify-center bg-discord-gray text-white">
                <DiscordLoginButton
                  style={{ position: "absolute", width: "25vw" }}
                  onClick={() => (window.location.href = oauthURL)}
                />
              </div>
            </>
          )
        ) : 
        selectedYear.id === parseInt(new Date().getFullYear()) ? (
          <>
            <div
              className="text-center relative p-5 lg:w-[750px] lg:mx-auto md:p-10 lg:p-15"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              <h2 className="text-4xl font-bold">
                Voting has not opened yet.
                <br />
                Come back on January 5
              </h2>
              <br />
              <b>
                <u>Rules</u>
              </b>
              <ul>
                <li>
                  The consideration period is January 4 {selectedYear.id} to{" "}
                  {selectedYear.id + 1}
                </li>
                <li>
                  Wrestlers must have competed in at least 10 matches
                  <br />
                  (These matches must have aired)
                </li>
                <li>Voting ends January 18</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div
              className="text-center relative p-5 lg:w-[750px] lg:mx-auto md:p-10 lg:p-15"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              <h2 className="text-4xl font-bold">Results</h2>
            </div>
            <img
              className="relative w-full lg:w-auto lg:left-1/2 lg:-ml-[375px]"
              src={`../images/${selectedYear.id}.png`}
            ></img>
          </>
        )}
      </div>
    </div>
  );
}

export default VotingApp;
