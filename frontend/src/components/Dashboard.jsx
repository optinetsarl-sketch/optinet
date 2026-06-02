import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-3 gap-6">

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500">Utilisateurs</h3>
        <p className="text-2xl font-bold text-yellow-500">12</p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500">Maisons</h3>
        <p className="text-2xl font-bold text-yellow-500">4</p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500">Visites</h3>
        <p className="text-2xl font-bold text-yellow-500">300</p>
      </div>

    </div>
  );
};

export default Dashboard;