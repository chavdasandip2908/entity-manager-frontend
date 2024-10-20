import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center   bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome to the Collection & Item Manager App
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-lg mb-4">
                This project allows you to manage your collections and items effortlessly.
            </p>
            <ul className="list-disc text-left text-gray-700 space-y-2 mb-6">
                <li>Create new collections and items.</li>
                <li>Update collection and item names.</li>
                <li>Delete unwanted collections or items.</li>
            </ul>
            <p className="text-lg text-gray-600 text-center max-w-lg">
                Whether you're organizing collections or managing items, this tool will help you efficiently handle your data.
            </p>
        </div>
    );
};

export default Home;
