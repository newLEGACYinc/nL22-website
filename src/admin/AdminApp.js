import React, { useState } from "react";
import { Tab } from '@headlessui/react';
import axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function AdminApp() {
    const [categories] = useState({
        "General": [
            {
                id: 1,
                title: 'Blacklist View',
                type: "request",
                url: ""
            },
            {
                id: 2,
                title: 'Blacklist Add',
                type: "update",
                url: ""
            },
            {
                id: 3,
                title: 'Blacklist Delete',
                type: "update",
                url: ""
            },
            {
                id: 4,
                title: 'Whitelist View',
                type: "request",
                url: ""
            },
            {
                id: 5,
                title: 'Whitelist Add',
                type: "update",
                url: ""
            },
            {
                id: 6,
                title: 'Whitelist Delete',
                type: "update",
                url: ""
            },
        ],
        "Kayfable": [
            {
                id: 1,
                title: 'Build Database',
                type: "request",
                url: "/api/kayfable/scrape"
            },
            {
                id: 2,
                title: 'Reset Database',
                type: "request",
                url: ""
            },
            {
                id: 3,
                title: 'View Wrestler Database',
                type: "request",
                url: ""
            },
            {
                id: 4,
                title: 'View Gimmick Database',
                type: "request",
                url: ""
            },
            {
                id: 5,
                title: 'View Answer',
                type: "request",
                url: ""
            },
            {
                id: 6,
                title: 'Reset Answer',
                type: "request",
                url: ""
            },
        ],
        "Higher or Lower": [
            {
                id: 1,
                title: "Build Database",
                type: "request",
                url: "/api/higherorlower/scrape"
            },
            {
                id: 2,
                title: "Reset Database",
                type: "request",
                url: ""
            },
            {
                id: 3,
                title: "View Database",
                type: "request",
                url: ""
            },
        ]
    })

    function request(url) {
        axios.get(url).then((res) => {
            console.log(res)
        })

    }

    return (
        <div className="w-full px-2 py-16 sm:px-0">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {Object.keys(categories).map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {Object.values(categories).map((posts, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                            )}
                        >
                            <ul>
                                {posts.map((post) => (
                                    <li
                                        key={post.id}
                                        className="relative rounded-md p-3 hover:bg-gray-100"
                                    >
                                        <h3 className="text-sm font-medium leading-5">
                                            {post.title}
                                        </h3>

                                        <button
                                            onClick={() => request(`${post.url}`)}
                                            className={classNames(
                                                'absolute inset-0 rounded-md',
                                                'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                                            )}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

export default AdminApp;
