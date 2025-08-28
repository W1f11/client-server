import React, { useEffect, useState } from 'react';
import './listing.css';
import { BsArrowRightShort } from "react-icons/bs";

import img5 from '../../../../Assets/p1.jpg';
import img6 from '../../../../Assets/p2.jpg';
import img7 from '../../../../Assets/p3.jpg';
import img8 from '../../../../Assets/p4.jpg';

const Listing = () => {
  const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
          // Récupération du token stocké
          const token = localStorage.getItem("token"); // à définir lors de l'authentification

          const res = await fetch("https://jsonplaceholder.typicode.com/users", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

          const data = await res.json();
          setUsers(data);
        } catch (err) {
          console.error(err);
          setError("Impossible de récupérer les utilisateurs. Veuillez réessayer.");
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, []);

    const handleDelete = (id) => {
      if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        setUsers(users.filter(user => user.id !== id));
      }
    };

    if (loading) return <p>Chargement des utilisateurs...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Tableau des Utilisateurs</h2>
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Téléphone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="listingSection">
      <div className="heading flex">
        
      </div>

      {/* Tableau des utilisateurs */}
      <UsersTable />

      <div className="sellers flex">
        <div className="topSellers">
          <div className="heading flex">
            <h3>Top Sellers</h3>
            <button className='btn flex'>
              See All <BsArrowRightShort className='icon'/>
            </button>
          </div>
          <div className="card flex">
            <div className="users">
              <img src={img5} alt="User" />
              <img src={img6} alt="User" />
              <img src={img7} alt="User" />
              <img src={img8} alt="User" />
            </div>
            <div className="cardText">
              <span>
                14,556 Plant sold <br />
                <small>
                  21 Sellers <span className='date'>7 Days</span>
                </small>
              </span>
            </div>
          </div>
        </div>

        <div className="featuredSellers">
          <div className="heading flex">
            <h3>Featured Sellers</h3>
            <button className='btn flex'>
              See All <BsArrowRightShort className='icon'/>
            </button>
          </div>
          <div className="card flex">
            <div className="users">
              <img src={img5} alt="User" />
              <img src={img6} alt="User" />
              <img src={img7} alt="User" />
              <img src={img8} alt="User" />
            </div>
            <div className="cardText">
              <span>
                28,556 Plant sold <br />
                <small>
                  28 Sellers <span className='date'>31 Days</span>
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Listing;
