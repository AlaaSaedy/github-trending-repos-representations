import React, { useState, useEffect } from "react";
import StarIcon from "./Stars";
import axios from "axios";
import LocalStorageKey from "./Constants";

export default function AlignItemsList() {
  const [reposData, setReposData] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const weekQuery = new Date(new Date().setDate(new Date().getDate() - 7))
    .toISOString()
    .slice(0, 10);

  useEffect(() => {
    getRepos();
  }, [isFiltered]);

  const getStaredRepos = () => {
    let stars = [];
    try {
      stars = JSON.parse(localStorage[LocalStorageKey]);
    } catch (error) {}
    return stars;
  };

  const getRepos = () => {
    axios(
      `https://api.github.com/search/repositories?q=created:>${weekQuery}&sort=stars&order=desc`
    ).then((response) => {
      if (isFiltered) {
        let staredRepos = getStaredRepos();
        setReposData(
          response.data.items.filter((a) => staredRepos.indexOf(a.id) > -1)
        );
      } else setReposData(response.data.items);
    });
  };

  if (reposData) {
    return (
      <div className="bg-white w-1/2 mx-auto mt-16 border">
        <div className="h-16 mt-5 mr-5">
          <button
            className="h-8 w-24 bg-blue-500 block ml-auto font-semibold"
            onClick={() => {
              setIsFiltered(true);
            }}
          >
            Filter
          </button>
          {isFiltered && (
            <button
              className="h-8 w-24 bg-blue-500 block ml-auto font-semibold mt-2"
              onClick={() => {
                setIsFiltered(false);
              }}
            >
              Reset
            </button>
          )}
        </div>
        {!reposData.length ? (
          <div className="my-3 text-center">No data</div>
        ) : (
          reposData.map(
            ({ name, html_url, description, stargazers_count, id }) => (
              <div key={id} className="mx-auto">
                <div className="flex py-4 px-4">
                  <img
                    className="h-16"
                    src="https://i.imgur.com/IA9OqVQ.png"
                    alt=""
                  />
                  <div className="w-3/4 ml-3">
                    <h3 className="font-bold">{name}</h3>
                    <p className="mt-2">{description}</p>
                    <div className="my-2 font-semibold">
                      Stars:{" "}
                      <span className="font-normal">{stargazers_count}</span>
                    </div>
                    <a
                      className="mb-3 inline-block font-semibold"
                      href={html_url}
                    >
                      Github
                    </a>
                  </div>
                  <StarIcon repoId={id} />
                </div>
                <hr className="mx-auto" />
              </div>
            )
          )
        )}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
