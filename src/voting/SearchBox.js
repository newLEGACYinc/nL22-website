import React, { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";

function SearchBox(props) {
  const [searchTerm, setSearchTerm] = useState([{ term: "" }]);
  const [autoComplete, setAutoComplete] = useState([]);
  const [selectedWrestler, setSelectedWrestler] = useState("");

  useEffect(() => {
    try {
      if (props.selectedWrestler) {
        if (props.nameList) {
          setSelectedWrestler(
            props.nameList.find((v) => v.id === props.selectedWrestler)["name"]
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.selectedWrestler, props.nameList]);

  useEffect(() => {
    async function searchFunction() {
      if (searchTerm.length > 0) {
        try {
          if (searchTerm != "") {
            const searchAutoComplete = matchFunction(searchTerm);
            setAutoComplete(() => searchAutoComplete);
          }
        } catch (error) {}
      } else {
        setAutoComplete([]);
      }
    }
    searchFunction();
  }, [searchTerm]);

  function matchFunction(searchTerm) {
    let suggestions = [];
    if (searchTerm.length > 0) {
      const regex = new RegExp(`${searchTerm}`, "i");
      suggestions = props.nameList.filter((v) => regex.test(v.gimmick));
    }
    const suggestionList = Array.from(
      new Set(suggestions.sort(compare).map((v) => v.id))
    ).map((id) => {
      return suggestions.find((v) => v.id === id);
    });
    return suggestionList.splice(0, 9);
  }

  function compare(a, b) {
    const gimmickA = a.gimmick.toUpperCase();
    const gimmickB = b.gimmick.toUpperCase();

    var comparison = 0;
    var x = gimmickA.match(searchTerm.toUpperCase());
    var y = gimmickB.match(searchTerm.toUpperCase());
    if (x.index === y.index) {
      if (gimmickA > gimmickB) {
        comparison = 1;
      } else if (gimmickA < gimmickB) {
        comparison = -1;
      }
    } else if (x.index > y.index) {
      comparison = 1;
    } else if (x.index < y.index) {
      comparison = -1;
    }
    return comparison;
  }

  async function match(id) {
    if (id) {
      try {
        if (Object.values(props.ballot).indexOf(id) > -1) {
          setSelectedWrestler("");
        } else {
          const newBallot = { ...props.ballot, [props.place]: id };
          props.updateBallot(newBallot);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Nothing to match against");
    }
  }

  function getOrdinal(n) {
    let ord = "th";

    if (n % 10 == 1 && n % 100 != 11) {
      ord = "st";
    } else if (n % 10 == 2 && n % 100 != 12) {
      ord = "nd";
    } else if (n % 10 == 3 && n % 100 != 13) {
      ord = "rd";
    }

    return ord;
  }

  return (
    <div className="relative mx-auto my-5">
      <div className="flex ml-[-2.5rem]">
        <Combobox
          value={selectedWrestler}
          onChange={(def) => {
            setSelectedWrestler(def.name);
            match(def.id);
          }}
        >
          <Combobox.Label className="pl-7 pr-10 mt-2 w-20 ml-2 font-bold text-justify" style={{textShadow: "1px 1px 2px black"}}>{`${
            props.place
          }${getOrdinal(props.place)}`}</Combobox.Label>
          <Combobox.Input
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-64 md:w-80 border-2 text-center rounded-md md:pl-4 md:pr-4 py-2
                 focus:border-indigo-600 focus:outline-none focus:shadow-outline text-black drop-shadow-xl"
          />
          <Combobox.Options className="absolute inset-x-0 top-full bg-blue-200 border border-blue-500 w-64 md:w-80 text-center rounded z-20 ml-12">
            {autoComplete.map((definition, index) => (
              <Combobox.Option key={index} value={definition}>
                {({ active }) => (
                  <div
                    className={`relative px-4 py-2 ${
                      active
                        ? "bg-blue-500 text-white"
                        : "bg-indigo-200 text-blue-700"
                    }`}
                  >
                    {definition.name === definition.gimmick
                      ? definition.name
                      : `${definition.gimmick} (${definition.name})`}
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </div>
  );
}

export default SearchBox;
