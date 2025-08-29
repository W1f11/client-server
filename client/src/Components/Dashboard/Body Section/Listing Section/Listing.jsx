import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import "./listing.css";

const Listing = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activityChartRef = useRef(null);
  const userDistributionChartRef = useRef(null);
  const [activityChartInstance, setActivityChartInstance] = useState(null);
  const [distributionChartInstance, setDistributionChartInstance] = useState(null);

  // Récupération des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://jsonplaceholder.typicode.com/users", {
          headers: { Authorization: `Bearer ${token}` },
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

  // Création des graphiques
  useEffect(() => {
    if (activityChartRef.current && !activityChartInstance) {
      const ctx = activityChartRef.current.getContext("2d");
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
          datasets: [
            {
              label: "Utilisateurs actifs",
              data: [120, 210, 180, 270, 150, 200, 180],
              borderColor: "#4a6cf7",
              backgroundColor: "rgba(74,108,247,0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          devicePixelRatio: 2,
        },
      });
      setActivityChartInstance(chart);
    }

    if (userDistributionChartRef.current && !distributionChartInstance) {
      const ctx = userDistributionChartRef.current.getContext("2d");
      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Administrateurs", "Modérateurs", "Éditeurs", "Utilisateurs"],
          datasets: [
            {
              data: [10, 15, 25, 50],
              backgroundColor: ["#4a6cf7", "#6a11cb", "#ff9f43", "#2ecc71"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          devicePixelRatio: 2,
          cutout: "70%",
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                font: { size: 14 },
                color: "#333",
              },
            },
          },
        },
      });
      setDistributionChartInstance(chart);
    }

    return () => {
      if (activityChartInstance) activityChartInstance.destroy();
      if (distributionChartInstance) distributionChartInstance.destroy();
    };
  }, [users]);

  // Supprimer utilisateur
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);

      if (distributionChartInstance) {
        distributionChartInstance.data.datasets[0].data = [
          Math.floor(Math.random() * 20) + 5,
          Math.floor(Math.random() * 20) + 5,
          Math.floor(Math.random() * 30) + 10,
          Math.floor(Math.random() * 40) + 30,
        ];
        distributionChartInstance.update();
      }
    }
  };

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Tableau de Bord</h2>

      {/* Cartes Statistiques */}
      <div className="stats">
        <div className="card"><h3>Utilisateurs totaux</h3><p className="number">1,254</p></div>
        <div className="card"><h3>Taux d'engagement</h3><p className="number green">82%</p></div>
        <div className="card"><h3>Nouvelles commandes</h3><p className="number orange">324</p></div>
        <div className="card"><h3>Problèmes non résolus</h3><p className="number red">12</p></div>
      </div>

      {/* Graphiques */}
      <div className="charts">
        <div className="chart-box"><h3>Activité des utilisateurs</h3><canvas ref={activityChartRef}></canvas></div>
        <div className="chart-box"><h3>Répartition des utilisateurs</h3><canvas ref={userDistributionChartRef}></canvas></div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="table-container">
        <h3>Liste des utilisateurs</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="user-cell">
                  <div className="avatar">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="username">{user.name}</span>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                    <span className="delete-icon">🗑</span> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Listing;